# Public Artiforce documentation

This repository and its complete Git history are public. Publish only customer guides, public integration contracts, approved product direction and customer-facing release notes. Never add internal research, customer interviews, audits, deployment evidence, secrets or unpublished editorial drafts, including on branches.

Write customer-facing material in French. Use Artiforce for the current product name. Preserve historical Artinova context and exact technical identifiers, URLs, event names and API fields. Keep API-key, user-session and secret-link capabilities distinct.

Keep the visual design minimal: system fonts, neutral reading surfaces, a restrained type scale, consistent spacing, monochrome icons and visible keyboard focus. Preserve the soft lavender-to-mint gradient on the homepage banner in both themes; it is an intentional exception to the otherwise neutral surfaces. Check mobile layouts and light/dark contrast when changing styles.

For release notes, separate publication and verified availability dates. Record proof in the team's private documentation. Do not infer availability from a merge, a successful CI job or a release tag alone. Group minor corrections; explain customer impact and activation prerequisites. Submit changes for pull-request review.

Run `pnpm check`, `pnpm build` and `pnpm check:build`. Keep broken-link failures enabled. Use conventional commits and the developer's configured Git identity; do not add a co-author.
