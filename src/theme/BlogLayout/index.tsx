import OriginalBlogLayout from "@theme-original/BlogLayout";
import { useLocation } from "@docusaurus/router";
import type { Props } from "@theme/BlogLayout";

export default function BlogLayout(props: Props) {
  const { pathname } = useLocation();
  const isPostsList = /^\/nouveautes(?:\/page\/\d+)?\/?$/.test(pathname);

  return (
    <OriginalBlogLayout {...props}>
      {isPostsList && (
        <header className="margin-bottom--lg">
          <h1>Les nouveautés Artiforce</h1>
          <p>Les améliorations et corrections du logiciel pour les entreprises du bâtiment, avec leurs dates de disponibilité et leurs conditions d’accès.</p>
        </header>
      )}
      {props.children}
    </OriginalBlogLayout>
  );
}
