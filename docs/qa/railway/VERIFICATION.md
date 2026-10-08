# Railway-inspired UI verification

Repository: `/home/newnol/orca/projects/selfhost-directory`, branch `feat/railway-ui-ux`.

## Commands actually executed

Node 22.16.0 and corepack pnpm 10.34.6 (runtime unpacked from existing scratch archive; Node was absent from initial PATH).

| Command | Result |
| --- | --- |
| `corepack pnpm install --frozen-lockfile` | pass; lockfile unchanged; package manager reported ignored esbuild/sharp scripts, subsequent builds succeeded |
| `corepack pnpm lint` | pass (repository lint script is TypeScript, not ESLint) |
| `corepack pnpm typecheck` | pass |
| `corepack pnpm test` | 79 pass, 0 fail; installer tests use existing sandbox/fake tools, no real deployment |
| `corepack pnpm validate:catalog` | 28 projects, 6 categories, 9 use cases valid |
| `corepack pnpm build` | pass; 107 generated static pages |
| `corepack pnpm exec tsx scripts/http-smoke.ts` | 95 page requests pass; deterministic advisor 200; malformed hardware 400 |
| `corepack pnpm test:deployment-docs` | 30 traces, 56 exact markdown documents, 10 invalid-route 404s, 3 exact downloads/HEAD/MIME/checksum pass |
| `node scripts/redesign-browser-qa.cjs` with QA_BASE/module overrides | 84 responsive route cases, light/dark OS preferences × 360/768/1440 × VI/EN; zero overflow/page errors; keyboard skip/menu/Escape/table scroll, search/empty/reset/filter/compare pass |
| `node scripts/browser-qa.cjs` with module/port overrides | real Chromium; unconfigured advisor 403 and configured deterministic 200 in VI/EN; compare selection/query, partial unknown compatibility, archived warning and cross-origin 403 pass |
| `node scripts/railway-browser-qa.cjs` with QA_BASE/module overrides | 66 route/viewport/locale cases, **zero axe WCAG A/AA violations**, zero page errors; query-preserving locale switch, collapsible filters, comparison cap, detail anchors, 404 recovery and native submission validation pass |
| `git diff --check` | pass |

The submission failure scenario aborts transport before the request reaches the server. No submission record or email was created. Claude real-network success was not tested or claimed. No installer was manually run; no application deployment was started. Local Next servers were for QA only.

## Route coverage

UI matrix in `route-evidence.json`: `/vi` and `/en`, each with home; `/categories/media`; `/alternatives/google-photos`; `/projects/immich`, `/projects/uptime-kuma`, `/projects/file-browser`; empty, valid and invalid `/compare`; `/advisor`; `/submit-project`, at 360, 768, 1440px. Separate checks assert HTTP 404 plus localized recovery for nonexistent projects. HTTP smoke exercises all 28 project, all 6 category and all 9 alternative pages in both languages, plus planning/submission/root routes. Exact machine docs and versioned artifact semantics are covered separately.

Interaction coverage: search result/empty/reset, category/deployment, max-three selection and removal, comparison GET submit, unknown/insufficient hardware, advisor loading/results/error and consent/fallback, closed-details native validation, archived and experimental installer warnings, mobile menu/Escape/focus return, skip link, scrollable comparison, code keyboard scrollability, route-preserving locale change and submission network error. Route error boundary is markup-tested, not deliberately triggered with production exceptions. Clipboard success/failure was not separately exercised.

## Evidence (absolute paths)

- Matrix and axe findings: `/home/newnol/orca/projects/selfhost-directory/docs/qa/railway/route-evidence.json`
- Desktop VI home: `/home/newnol/orca/projects/selfhost-directory/docs/qa/railway/vi-1440-home.png`
- Mobile VI home: `/home/newnol/orca/projects/selfhost-directory/docs/qa/railway/vi-360-home.png`
- Desktop EN advisor: `/home/newnol/orca/projects/selfhost-directory/docs/qa/railway/en-1440-advisor.png`
- Mobile EN comparison: `/home/newnol/orca/projects/selfhost-directory/docs/qa/railway/en-360-compare-projects-immich-jellyfin.png`
- Mobile experimental installer: `/home/newnol/orca/projects/selfhost-directory/docs/qa/railway/vi-360-projects-uptime-kuma.png`
- 44 final screenshots: locale × desktop/mobile × 11 route states in the same folder.
- Actual execution logs: `lint-results.log`, `typecheck-results.log`, `test-results.log`, `build-results.log`, `catalog-results.log`, `http-results.log`, `machine-docs-results.log`, `browser-results.log`, `planning-results.log`, `responsive-results.log` in that folder.

Initial axe findings (keyboard-unreachable code scroll areas and exposed unlabeled bot trap) were fixed and retested. A locale-wide loading boundary introduced streamed 200 responses for missing markdown; it was removed and exact 404 smoke passed. Vision analysis repeatedly returned HTTP 400, so no visual approval is claimed; screenshots and real DOM/browser checks are available for the independent reviewer. No push, PR, merge, deployment or remote changes.

## Reproduce browser matrix

Install Playwright and `@axe-core/playwright` into a separate scratch QA runtime, start the production build locally, then:

```sh
QA_BASE=http://127.0.0.1:4343 \
PLAYWRIGHT_MODULE=/home/newnol/.hermes/cache/scratch/browser-qa-runtime/node_modules/playwright \
AXE_MODULE=/home/newnol/.hermes/cache/scratch/browser-qa-runtime/node_modules/@axe-core/playwright \
node scripts/railway-browser-qa.cjs
```
