import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import path from 'node:path';
const root=process.cwd();
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const text=p=>readFileSync(p,'utf8');
const sourceFiles=[...files('docs'),...files('blog'),...files('static')];
const forbidden=[/github\.com\/artinova-software\/artinova(?:\/|[)#\s])/i,/editorial\/(?:evidence|source-prs)/i,/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/,/\bgh[pousr]_[A-Za-z0-9]{20,}/,/\bsk_(?:live|test)_[A-Za-z0-9]{16,}/];
for(const p of sourceFiles.filter(p=>/\.(md|mdx|json|ya?ml|svg|txt)$/.test(p))){
 const s=text(p);for(const pattern of forbidden) assert(!pattern.test(s),`Contenu privé détecté dans ${p}`);
 if(p.startsWith('docs/'))assert(!/doc_state:\s*(historical|proposal|prototype)/.test(s),`Document interne dans ${p}`);
 if(p.startsWith('blog/')&&p.endsWith('.md')){
  assert(!/^status:\s*draft/m.test(s),`Brouillon public dans ${p}`);
  const publication=s.match(/^date: "?(\d{4}-\d{2}-\d{2})/m)?.[1];
  const available=s.match(/^availability_date: "?(\d{4}-\d{2}-\d{2})/m)?.[1];
  assert(publication&&available&&publication>=available,`Dates manquantes ou incohérentes dans ${p}`);
  assert(s.includes('<!-- truncate -->'),`Résumé manquant dans ${p}`);
  for(const [,asset] of s.matchAll(/\]\((\/assets\/[^)]+)\)/g))assert(existsSync('static'+asset),`Média manquant ${asset}`);
 }
}
const posts=files('blog').filter(p=>p.endsWith('.md'));assert(posts.length>=19,'Reprise des 18 articles et du nouvel article incomplète');
for(const d of ['00-product','01-architecture','02-tech-stack','08-devops','10-versioning','11-design','12-contributing','13-einvoicing','marketing','_drafts','archives','internal'])assert(!existsSync(`docs/${d}`),`Répertoire interne ${d}`);
const api=JSON.parse(text('static/api/openapi/planning-2026-10-26.json'));
assert(api.openapi==='3.0.0');assert(Object.keys(api.paths).length===12);
for(const [route,item] of Object.entries(api.paths)){
 assert(route.startsWith('/v1/tenants/{tenantId}/planning/'));
 for(const [method,operation] of Object.entries(item)){
  assert(method!=='delete',`Suppression exposée dans ${route}`);
  assert(operation.security?.some(x=>x.planningApiKey),`Authentification de clé absente dans ${route}`);
 }
}
function refs(node){if(Array.isArray(node))node.forEach(refs);else if(node&&typeof node==='object')for(const [key,value]of Object.entries(node)){if(key==='$ref'){assert(value.startsWith('#/'));let target=api;for(const part of value.slice(2).split('/'))target=target?.[part];assert(target,`Référence OpenAPI absente ${value}`);}else refs(value);}}
refs(api);
if(process.argv.includes('--build')){
 assert(existsSync('build/index.html'),'Construire le site avant ce contrôle');
 const output=files('build');
 for(const p of output.filter(p=>/\.(html|json|xml|txt|js|css)$/.test(p))){
  const s=text(p);for(const pattern of forbidden)assert(!pattern.test(s),`Contenu privé dans la publication ${p}`);
 }
 const rss=text('build/nouveautes/rss.xml');
 assert.equal((rss.match(/<item>/g)||[]).length,posts.length,'Tous les articles doivent figurer dans le RSS');
 for(const post of posts){const slug=text(post).match(/^slug:\s*"?([^"\n]+)/m)?.[1];assert(rss.includes(`/nouveautes/${slug}`),`Article absent du flux ${slug}`);assert(existsSync(`build/nouveautes/${slug}.html`)||existsSync(`build/nouveautes/${slug}/index.html`),`Article non généré ${slug}`);}
 for(const route of ['guide','api','roadmap','vision','nouveautes'])assert(output.some(p=>p===`build/${route}.html`||p===`build/${route}/index.html`),`Route absente ${route}`);
 assert(text('build/index.html').includes('Devis, factures et planning :'),'Accueil absent');
 assert(text('build/sitemap.xml').includes('https://docs.artiforce.fr/'),'Domaine canonique incorrect');
 await import('./check-seo.mjs');
 console.log(`Publication contrôlée : ${posts.length} articles, RSS complet, routes et absence de contenus internes.`);
}else console.log(`Sources publiques contrôlées : ${posts.length} articles, médias et contrat OpenAPI.`);
