import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

type IconName = "book" | "code" | "updates";

function SectionIcon({ name }: { name: IconName }) {
  return (
    <svg
      className="home-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "book" && (
        <>
          <path d="M12 5.5C9.5 4 6.5 4 3 5v14c3.5-1 6.5-1 9 .5 2.5-1.5 5.5-1.5 9-.5V5c-3.5-1-6.5-1-9 .5Z" />
          <path d="M12 5.5v14" />
        </>
      )}
      {name === "code" && (
        <>
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </>
      )}
      {name === "updates" && (
        <>
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M6.2 6.2A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.8 5.8" />
        </>
      )}
    </svg>
  );
}

const paths: {
  icon: IconName;
  title: string;
  description: string;
  to: string;
  action: string;
}[] = [
  {
    icon: "book",
    title: "Prendre en main Artiforce",
    description:
      "Clients, devis, factures et planning : les repères pour votre quotidien.",
    to: "/guide",
    action: "Ouvrir le guide",
  },
  {
    icon: "code",
    title: "Connecter vos outils",
    description:
      "API de planification, calendriers, webhooks et réservation sur votre site.",
    to: "/api",
    action: "Explorer les intégrations",
  },
  {
    icon: "updates",
    title: "Suivre les nouveautés",
    description:
      "Les améliorations et corrections, expliquées avec leurs dates de disponibilité.",
    to: "/nouveautes",
    action: "Lire les publications",
  },
];

export default function Home() {
  return (
    <Layout
      title="Documentation et nouveautés"
      description="Prenez en main Artiforce, connectez vos outils et suivez les évolutions du logiciel pour les entreprises du bâtiment."
    >
      <main className="home-main">
        <div className="home-hero">
          <div className="home-shell">
            <header className="home-header">
              <p className="home-kicker">La documentation Artiforce</p>
              <h1>Votre travail avance.</h1>
              <p className="home-intro">
                Retrouvez les guides, les intégrations et les nouveautés pour
                travailler simplement avec Artiforce.
              </p>
              <div className="home-actions">
                <Link className="button button--primary" to="/guide">
                  Commencer avec le guide
                </Link>
                <Link className="home-text-link" to="/api">
                  Consulter l’API <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </header>
          </div>
        </div>
        <div className="home-shell">
          <section className="home-paths" aria-labelledby="choose-path">
            <div className="home-section-heading">
              <h2 id="choose-path">Que souhaitez-vous faire ?</h2>
              <p>Choisissez votre point de départ.</p>
            </div>
            <div className="home-grid">
              {paths.map((item) => (
                <Link key={item.to} className="home-card" to={item.to}>
                  <SectionIcon name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="home-card-action">
                    {item.action}
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <div className="home-resources">
            <section aria-labelledby="integration-resources">
              <div className="home-section-heading">
                <h2 id="integration-resources">Pour vos intégrations</h2>
                <p>Des références pour connecter vos services.</p>
              </div>
              <ul className="home-resource-list">
                <li>
                  <Link to="/api/planification">
                    <span>Planning et rendez-vous</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
                <li>
                  <Link to="/api/calendriers">
                    <span>Calendriers et abonnements ICS</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
                <li>
                  <Link to="/api/reservation">
                    <span>Réservation sur votre site</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              </ul>
            </section>
            <section aria-labelledby="product-direction">
              <div className="home-section-heading">
                <h2 id="product-direction">Comprendre la suite</h2>
                <p>Une direction partagée, nourrie par le terrain.</p>
              </div>
              <ul className="home-resource-list">
                <li>
                  <Link to="/roadmap">
                    <span>Les prochaines évolutions</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
                <li>
                  <Link to="/vision">
                    <span>Notre vision du produit</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
                <li>
                  <a href="https://docs.artiforce.fr/nouveautes/rss.xml">
                    <span>S’abonner aux nouveautés par RSS</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </section>
          </div>
          <p className="home-former-name">
            Artiforce est le nouveau nom d’Artinova.
          </p>
        </div>
      </main>
    </Layout>
  );
}
