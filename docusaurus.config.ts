import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";

const GITHUB_REPO_URL = "https://github.com/artinova-software/artiforce-docs";

const config: Config = {
  title: "Artiforce",
  tagline: "Le guide, les intégrations et les nouveautés de votre logiciel",
  url: "https://docs.artiforce.fr",
  baseUrl: "/",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",

  future: {
    faster: true,
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      // Keep custom styles authoritative with the current CSS minimizer.
      useCssCascadeLayers: false,
      siteStorageNamespacing: true,
      fasterByDefault: true,
      mdx1CompatDisabledByDefault: true,
    },
  },

  favicon: "brand/favicon.ico",

  i18n: {
    defaultLocale: "fr",
    locales: ["fr"],
    localeConfigs: {
      fr: { label: "Français", htmlLang: "fr-FR" },
    },
  },

  markdown: {
    format: "detect",
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: `${GITHUB_REPO_URL}/edit/main/`,
        },
        blog: {
          path: "blog",
          routeBasePath: "nouveautes",
          blogTitle: "Les nouveautés Artiforce",
          blogDescription: "Nouveautés, améliorations et corrections du logiciel Artiforce, anciennement Artinova.",
          blogSidebarTitle: "Les publications",
          blogSidebarCount: "ALL",
          postsPerPage: 8,
          showReadingTime: false,
          feedOptions: { type: ["rss", "atom"], limit: false, copyright: "Artiforce" },
          processBlogPosts: async ({ blogPosts }) => blogPosts.sort((a, b) => {
            const published = new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
            return published || String(b.metadata.frontMatter.availability_date).localeCompare(String(a.metadata.frontMatter.availability_date));
          }),
          onUntruncatedBlogPosts: "throw",
          editUrl: `${GITHUB_REPO_URL}/edit/main/`,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-pwa",
      {
        offlineModeActivationStrategies: [
          "appInstalled",
          "standalone",
          "queryString",
        ],
        injectManifestConfig: {
          // Les pages sont servies sans .html (trailingSlash: false et cleanUrls).
          manifestTransforms: [async (entries) => ({
            manifest: entries.map((entry) => ({
              ...entry,
              url: entry.url.endsWith(".html") && !entry.url.endsWith("index.html")
                ? entry.url.slice(0, -5)
                : entry.url,
            })),
            warnings: [],
          })],
        },
        pwaHead: [
          { tagName: "link", rel: "icon", type: "image/png", sizes: "32x32", href: "/brand/favicon-32x32.png" },
          { tagName: "link", rel: "icon", type: "image/png", sizes: "16x16", href: "/brand/favicon-16x16.png" },
          { tagName: "link", rel: "manifest", href: "/manifest.webmanifest" },
          { tagName: "meta", name: "theme-color", content: "#1869ff" },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-title",
            content: "Artiforce Docs",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-status-bar-style",
            content: "default",
          },
          {
            tagName: "link",
            rel: "apple-touch-icon",
            href: "/brand/apple-touch-icon.png",
          },
        ],
      },
    ],
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en", "fr"],
        docsRouteBasePath: "/",
        docsDir: "docs",
        indexBlog: true,
        blogRouteBasePath: "/nouveautes",
      },
    ],
  ],

  themeConfig: {
    image: "assets/social/index.png",
    metadata: [
      { property: "og:site_name", content: "Artiforce — Documentation" },
      { property: "og:type", content: "website" },
    ],
    navbar: {
      title: "Artiforce",
      logo: { alt: "Artiforce", src: "brand/android-chrome-192x192.png" },
      items: [
        {
          type: "docSidebar",
          sidebarId: "guideSidebar",
          label: "Guide",
          position: "left",
        },
        {
          type: "docSidebar",
          sidebarId: "apiSidebar",
          label: "API et intégrations",
          position: "left",
        },
        { to: "/nouveautes", label: "Nouveautés", position: "left" },
        { to: "/roadmap", label: "Roadmap", position: "left" },
        { to: "/vision", label: "Vision", position: "left" },
        {
          href: GITHUB_REPO_URL,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        { title: "Utiliser Artiforce", items: [
          { label: "Le guide", to: "/guide" },
          { label: "Connecter vos outils", to: "/api" },
        ] },
        { title: "Suivre le produit", items: [
          { label: "Les nouveautés", to: "/nouveautes" },
          { label: "La roadmap", to: "/roadmap" },
          { label: "Flux RSS", href: "https://docs.artiforce.fr/nouveautes/rss.xml" },
        ] },
      ],
      copyright: `© ${new Date().getFullYear()} Artiforce · Anciennement Artinova`,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
