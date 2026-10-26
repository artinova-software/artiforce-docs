import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function Home() {
  return (
    <Layout title="Documentation et nouveautés" description="Prenez en main Artiforce, connectez vos outils et suivez les évolutions du logiciel pour les entreprises du bâtiment.">
      <main>
        <section className="home-hero">
          <div className="container">
            <p className="home-eyebrow">LA DOCUMENTATION ARTIFORCE</p>
            <h1>Votre travail avance.<br />Vos outils aussi.</h1>
            <p className="home-intro">Les repères pour utiliser Artiforce au quotidien, connecter vos outils et comprendre ce qui change.</p>
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
        <section className="container home-future">
          <div><p className="home-eyebrow">CONSTRUIRE LA SUITE</p><h2>Une direction partagée.</h2><p>Retrouvez nos priorités et les principes qui guident Artiforce. La roadmap évolue avec les retours du terrain.</p></div>
          <div className="home-actions"><Link className="button button--outline button--primary" to="/roadmap">Consulter la roadmap</Link><Link className="button button--outline button--primary" to="/vision">Lire notre vision</Link></div>
        </section>
      </main>
    </Layout>
  );
}
