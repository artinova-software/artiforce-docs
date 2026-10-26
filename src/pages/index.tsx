import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function Home() {
  return (
    <Layout title="Guides devis, factures et planning bâtiment" description="Utilisez Artiforce pour vos devis, factures et chantiers : guides pour les artisans du bâtiment, planning, stocks et documentation des intégrations API.">
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://docs.artiforce.fr/#website",
            name: "Documentation Artiforce",
            alternateName: "Artiforce",
            url: "https://docs.artiforce.fr/",
            inLanguage: "fr-FR",
            description: "Guides et intégrations du logiciel Artiforce pour les entreprises du bâtiment.",
          })}
        </script>
      </Head>
      <main>
        <section className="home-hero">
          <div className="container">
            <p className="home-eyebrow">LA DOCUMENTATION ARTIFORCE</p>
            <h1>Devis, factures et planning :<br />le guide Artiforce.</h1>
            <p className="home-intro">Les guides pour gérer votre entreprise du bâtiment avec Artiforce : préparer vos devis, facturer vos chantiers, suivre les paiements et organiser les interventions de votre équipe.</p>
            <div className="home-actions">
              <Link className="button button--primary button--lg" to="/guide">Prendre en main Artiforce</Link>
              <Link className="button button--secondary button--lg" to="/nouveautes">Voir les nouveautés</Link>
            </div>
            <p className="home-former-name">Artiforce est le nouveau nom d’Artinova.</p>
          </div>
        </section>
        <section className="container home-paths" aria-labelledby="choose-path">
          <h2 id="choose-path">Que souhaitez-vous faire ?</h2>
          <div className="home-grid">
            <Link className="home-card" to="/guide"><span>01 · AU QUOTIDIEN</span><h3>Utiliser le logiciel</h3><p>Du premier client au règlement : devis, factures, planning et échanges avec votre cabinet.</p><strong>Ouvrir le guide →</strong></Link>
            <Link className="home-card" to="/api"><span>02 · VOS INTÉGRATIONS</span><h3>Connecter vos outils</h3><p>API de planification, webhooks, calendriers et réservation à intégrer sur votre site.</p><strong>Explorer les intégrations →</strong></Link>
            <Link className="home-card" to="/nouveautes"><span>03 · LE PRODUIT ÉVOLUE</span><h3>Suivre les nouveautés</h3><p>Les améliorations et corrections expliquées, avec leurs dates et leurs conditions d’accès.</p><strong>Lire les publications →</strong></Link>
          </div>
        </section>
        <section className="container home-paths" aria-labelledby="practical-guides">
          <h2 id="practical-guides">Les guides pour votre entreprise du bâtiment</h2>
          <div className="home-grid">
            <article>
              <h3>Devis et facturation de chantier</h3>
              <ul>
                <li><Link to="/guide/parcours">Créer un client, un devis et une facture</Link></li>
                <li><Link to="/guide/batiment-et-tva">Suivre les acomptes, situations et le solde d’un chantier</Link></li>
                <li><Link to="/guide/personnaliser-vos-documents">Personnaliser les PDF de vos devis et factures</Link></li>
                <li><Link to="/guide/signer-un-devis">Faire signer un devis en ligne</Link></li>
              </ul>
            </article>
            <article>
              <h3>Paiements et comptabilité</h3>
              <ul>
                <li><Link to="/guide/factures-et-statuts">Comprendre les paiements, avoirs et relances</Link></li>
                <li><Link to="/guide/encaisser-en-ligne">Configurer l’encaissement en ligne</Link></li>
                <li><Link to="/guide/comptabilite-et-conservation">Préparer les pièces pour votre comptable</Link></li>
                <li><Link to="/guide/facturation-electronique">Comprendre la facturation électronique</Link></li>
              </ul>
            </article>
            <article>
              <h3>Planning, stock et intégrations</h3>
              <ul>
                <li><Link to="/guide/agenda">Organiser les rendez-vous de votre équipe</Link></li>
                <li><Link to="/guide/gestion-du-stock">Suivre les fournitures et les mouvements de stock</Link></li>
                <li><Link to="/api/reservation">Intégrer la réservation sur votre site</Link></li>
                <li><Link to="/api/planification">Connecter l’API de planification Artiforce</Link></li>
              </ul>
            </article>
          </div>
        </section>
        <section className="container home-future">
          <div><p className="home-eyebrow">CONSTRUIRE LA SUITE</p><h2>Une direction partagée.</h2><p>Retrouvez nos priorités et les principes qui guident Artiforce. La roadmap évolue avec les retours du terrain.</p></div>
          <div className="home-actions"><Link className="button button--outline button--primary" to="/roadmap">Consulter la roadmap</Link><Link className="button button--outline button--primary" to="/vision">Lire notre vision</Link></div>
        </section>
      </main>
    </Layout>
  );
}
