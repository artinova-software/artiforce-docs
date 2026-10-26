# Documentation publique Artiforce

Guide client, API et intégrations publiques, nouveautés, roadmap et vision d’Artiforce, anciennement Artinova.

Site : [docs.artiforce.fr](https://docs.artiforce.fr). Le domaine `changelog.artiforce.fr` sert le même site. Les chemins historiques `/p/<slug>` et `/feed.xml` restent utilisables.

## Développer

Node.js 24 et pnpm 12.14.0 sont utilisés pour le site Docusaurus.

```bash
pnpm install --frozen-lockfile
pnpm start
pnpm check
pnpm build
pnpm check:build
pnpm serve
```

## Contribuer

- `docs/guide/` : guides destinés aux clients, en français.
- `docs/api/` : intégrations, droits, exemples et conditions d’accès.
- `static/api/openapi/` : contrats publics OpenAPI versionnés.
- `blog/` : nouveautés relues avant publication ; modèle dans `templates/nouveaute.md`.
- `docs/roadmap.md` et `docs/vision.md` : priorités et direction du produit.

Une nouveauté décrit un changement vérifié et son bénéfice client. Distinguer sa date de disponibilité de sa date de publication. Garder les incertitudes historiques explicites. Une fusion ou un numéro de version ne suffisent pas à prouver une mise en production. Les preuves, recherches internes, entretiens clients et brouillons non publiables restent dans l’espace documentaire privé de l’équipe.

Les exemples utilisent des données fictives. Ne jamais ajouter de secret, de données réelles de clients ou de liens indispensables vers un dépôt privé. Les noms techniques existants `artinova`, les routes API et les attributs du widget sont conservés quand ils font partie du contrat d’intégration.

Chaque changement passe par une pull request. Employer des commits conventionnels, par exemple `docs: explain calendar subscriptions`. Les contrôles de pull request ne nécessitent aucun secret.

## Métadonnées et référencement

Chaque guide et publication possède un titre et une `description` explicite en français dans son front matter. La description résume le contenu réel de la page et ses éventuelles conditions d’accès. Une publication précise aussi son `image` de partage ; les autres pages utilisent l’image du site par défaut.

Docusaurus génère les URL canoniques sur `https://docs.artiforce.fr`, le sitemap et les données structurées des articles et fils d’Ariane. L’accueil décrit le site avec des données `WebSite`. Le fichier `static/robots.txt` autorise l’exploration et indique le sitemap. Conserver les chemins existants et les liens utiles entre les guides.

Le contrôle `pnpm check:build` vérifie les métadonnées, les images, les URL canoniques, les données structurées et la présence des pages principales dans le sitemap généré. Ces réglages facilitent la découverte et la présentation des pages ; ils ne garantissent pas leur classement dans les moteurs de recherche.

## Déploiement Vercel

Le projet `artiforce-docs` utilise le preset Docusaurus, Node.js 24, la racine du dépôt et le dossier de sortie `build/`. La configuration versionnée est dans `vercel.json`. Les publications de `main` alimentent la production via l’intégration Git de Vercel. Le site statique ne nécessite aucune variable secrète.

Les domaines `docs.artiforce.fr` et `changelog.artiforce.fr` sont rattachés au même projet, sans redirection entre domaines. La première adresse est l’adresse canonique des pages et des flux. Utiliser les valeurs DNS retournées par Vercel pour ce projet ; laisser les enregistrements en DNS uniquement si le fournisseur est Cloudflare.
