import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  guideSidebar: [
    "guide/index", "guide/produit", "guide/parcours", "guide/factures-et-statuts",
    "guide/personnaliser-vos-documents", "guide/agenda", "guide/gestion-du-stock",
    "guide/encaisser-en-ligne", "guide/signer-un-devis", "guide/comptabilite-et-conservation",
    "guide/facturation-electronique", "guide/batiment-et-tva", "guide/glossaire",
  ],
  apiSidebar: [
    "api/index", "api/authentification", "api/planification", "api/webhooks",
    "api/calendriers", "api/google-calendar", "api/reservation",
  ],
};

export default sidebars;
