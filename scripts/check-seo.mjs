import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';

const origin = 'https://docs.artiforce.fr';
const read = (file) => readFileSync(file, 'utf8');
const files = (dir) => readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});
const decode = (value) => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
  const named = {'&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>'};
  if (named[entity]) return named[entity];
  return String.fromCodePoint(entity.startsWith('&#x') ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10));
});
// Le HTML de production peut omettre les guillemets des attributs.
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
  .map(([, name, double, single, bare]) => [name, decode(double ?? single ?? bare)]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(([tag]) => attributes(tag));
const field = (source, name) => source.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '');
const sitemap = new Set([...read('build/sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => decode(url)));
const robots = read('build/robots.txt');
assert.match(robots, /^User-agent: \*$/m, 'Règles de robots absentes');
assert.match(robots, /^Allow: \/$/m, 'Exploration publique désactivée');
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Sitemap absent du fichier robots');

const routes = ['/', '/nouveautes'];
for (const dir of ['docs', 'blog']) {
  for (const file of files(dir).filter((file) => /\.mdx?$/.test(file))) {
    const frontMatter = read(file).match(/^---\n([\s\S]*?)\n---/)?.[1];
    assert(frontMatter && field(frontMatter, 'description'), `Description explicite manquante : ${file}`);
    const slug = field(frontMatter, 'slug') ?? file.slice(dir.length + 1).replace(/\.mdx?$/, '');
    routes.push(dir === 'blog' ? `/nouveautes/${slug}` : `/${slug.replace(/^\//, '')}`);
  }
}

const titles = new Set();
const descriptions = new Set();
for (const route of routes) {
  const file = route === '/' ? 'build/index.html' : `build${route}.html`;
  const html = read(file);
  const meta = tags(html, 'meta');
  const metadata = (name) => meta.find((tag) => tag.name === name || tag.property === name)?.content;
  const canonicals = tags(html, 'link').filter((tag) => tag.rel === 'canonical');
  assert.equal(canonicals.length, 1, `URL canonique ambiguë : ${route}`);
  assert.equal(canonicals[0].href, `${origin}${route}`, `URL canonique incorrecte : ${route}`);
  assert.equal(metadata('og:url'), `${origin}${route}`, `URL de partage incorrecte : ${route}`);
  assert(sitemap.has(`${origin}${route}`), `Page absente du sitemap : ${route}`);
  assert.equal(tags(html, 'html')[0]?.lang, 'fr', `Langue incorrecte : ${route}`);
  assert(!/noindex|nofollow/.test(metadata('robots') ?? ''), `Page non explorable : ${route}`);
  const title = decode(html.match(/<title\b[^>]*>(.*?)<\/title>/)?.[1] ?? '');
  const description = metadata('description');
  assert(title && !titles.has(title), `Titre absent ou dupliqué : ${route}`);
  assert(description && !descriptions.has(description), `Description absente ou dupliquée : ${route}`);
  titles.add(title);
  descriptions.add(description);
  assert.equal(metadata('og:title'), title, `Titre de partage incohérent : ${route}`);
  assert.equal(metadata('og:description'), description, `Description de partage incohérente : ${route}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Titre principal ambigu : ${route}`);
  const image = new URL(metadata('og:image'));
  assert.equal(image.origin, origin, `Domaine de l’image incorrect : ${route}`);
  assert(existsSync(`build${image.pathname}`), `Image de partage absente : ${route}`);
  assert.equal(metadata('twitter:image'), image.href, `Image de partage incohérente : ${route}`);
  const structured = [...html.matchAll(/<script\b[^>]*type=["']?application\/ld\+json["']?[^>]*>(.*?)<\/script>/g)]
    .map(([, json]) => JSON.parse(json));
  if (route === '/') {
    const website = structured.find((item) => item['@type'] === 'WebSite');
    assert.equal(website?.url, `${origin}/`, 'Données structurées du site absentes');
    assert.equal(website?.name, 'Documentation Artiforce', 'Nom du site incorrect');
  } else if (route.startsWith('/nouveautes/')) {
    const article = structured.find((item) => item['@type'] === 'BlogPosting');
    assert.equal(article?.url, `${origin}${route}`, `Données structurées d’article absentes : ${route}`);
    assert(article?.datePublished && article?.author, `Date ou auteur absent : ${route}`);
  } else if (/^\/(guide|api)(\/|$)/.test(route)) {
    assert(structured.some((item) => item['@type'] === 'BreadcrumbList'), `Fil d’Ariane structuré absent : ${route}`);
  }
}
console.log(`Référencement contrôlé : ${routes.length} pages, métadonnées, images, URL canoniques, données structurées, robots et sitemap.`);
