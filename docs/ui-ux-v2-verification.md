# UIUX v2 verification

## Delivered

Infrastructure catalog map with counts derived from the 28-project catalog; catalog immediately after hero; compact project cards with bounded comparison selection; deployment/category/search/reset/count/empty states; searchable native-checkbox comparison picker (2–3 projects), removable chips, disabled invalid submit; mobile menu disclosure with Escape focus return; progressive advisor needs/server/deployment groups with invalid-field disclosure, loading and catalog-backed results. Existing bilingual routes, light/dark tokens, reduced motion, compatibility/provenance and submission features retained.

## Execution evidence

- Typecheck passed; catalog validation: **28 projects, 6 categories, 9 use cases**.
- Test-first partial v2 suite: initially **1 pass / 4 expected feature failures**. Fixed ES target-incompatible test regex flags without changing assertions. Full final suite: **42 passed, 0 failed**.
- Production build passed: **101 static pages generated**.
- HTTP smoke: **95 page requests**, advisor deterministic fallback 200 with 3 unknown choices, invalid input 400.
- Chromium responsive matrix: **84 route/locale/theme/viewport combinations** (7 routes × 2 locales × 2 themes × 3 widths: 360, 768, 1440), no document overflow, reduced motion enabled, zero page errors.
- Real browser flows: keyboard skip link, mobile disclosure/Enter/Escape/focus return; catalog search/empty/reset/category/deployment and catalog-to-compare; comparison chips/search/no matches/2–3 bounds/disabled fourth and invalid submit/table scroll; advisor required validation with collapsed hardware reopening, both locales and both consent states; production origin behavior unconfigured 403 / configured 200; spoofed cross-origin 403; partial resource calculator and archived warning.

## Artifacts and limitations

Scratch artifact root: `/home/newnol/.hermes/cache/scratch/`.
- Genuine before captures retained from interrupted work: `ui-v2-before-{light,dark}-{360,768,1440}-home.png` (**6**).
- Genuine final captures: `ui-after-{light,dark}-{360,768,1440}-{home,projects,compare,advisor}.png` (**24**).
- `ui-v2-tests.log`, `ui-v2-build.log`, `ui-v2-designer.log`, `ui-v2-reviewer.log`.
- Genuine designer profile source consultation completed in 50 seconds (3-turn cap); genuine reviewer profile source review completed in 62 seconds (4-turn cap). Both returned CLI exit 1 because iteration budgets were exhausted, but produced real source-based findings. Neither performed visual or browser review. Reviewer found obsolete native-select QA selectors; updated and exercised them.
- Screenshot vision analysis failed with provider HTTP 400 on both attempted images. Screenshots exist and DOM/layout/interaction assertions passed, but no claim of model visual inspection or screen-reader audit is made.
- Node runtime supplied in context had disappeared; restored Node 22.16.0 from official distribution. No native design engine downloaded, no profile files modified.
- Default production advisor still requires an explicit allowed origin; QA verified failure and configured success rather than hiding the deployment constraint.

No merge or production promotion authorized or performed. PR remains draft; remote SHA and CI are checked after push and reported separately.
