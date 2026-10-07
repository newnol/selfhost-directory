# Expanded planning MVP integration

## Runtime origin configuration

The advisor never trusts `Forwarded`, `X-Forwarded-Host`, or `X-Forwarded-Proto` to authorize requests. Without configuration it compares browser Origin with the server request URL. Next production wildcard binding normalizes the latter to `0.0.0.0`, so requests through localhost/127.0.0.1 require an explicit public origin.

For the local production example:

```sh
ADVISOR_ALLOWED_ORIGINS=http://127.0.0.1:4312 npm start -- --hostname 0.0.0.0 --port 4312
```

Use a comma-separated exact list of public HTTP(S) origins for a reverse proxy or deployment, including port when non-default. No wildcards, URL paths, suffix matching, or forwarded-header authorization. A configured list overrides the internal URL; unlisted origins remain 403. Origin-less CLI calls remain supported. Optional Claude is disabled by default; browser consent alone never enables it.

## Integrated scope

28 projects / 6 categories / 9 use cases. Ten new modules are imported in the aggregate. Nine existing entries have official partial requirements evidence. Unknown dimensions remain unknown. Provenance notes support bilingual objects while preserving legacy string fixtures. Compare uses the same readable resource checks as calculator/advisor, with official source links and checked dates.

File Browser has explicit archived lifecycle, a bilingual detail warning, and is excluded from advisor recommendations. Stirling PDF open-core directory exceptions and Forgejo version-scoped license remain intact. All 18 old executable setup scripts were replaced with non-executable official-documentation referrals, removing their duplicate embedded Compose copies. Original unverified Compose samples remain under warnings; they are not deployment-tested recipes.

## Verification commands

```sh
npm test
npm run validate:catalog
npm run typecheck
npm run build
node_modules/.bin/tsx scripts/http-smoke.ts
PLAYWRIGHT_MODULE=/path/to/playwright node scripts/browser-qa.cjs
```

Browser harness is in the repository, uses real headless Playwright Chromium and actual submissions, and owns/stops its production servers. It first reproduces the four EN/VI 403 submissions without origin configuration; then starts with the explicit origin and asserts four 200 deterministic submissions (consent off/on), advisor-to-compare navigation, native compare selection/invalid selection, readable localized provenance, below-minimum/partial-unknown calculator, archived warning and cross-origin 403. No API interception or provider credentials.

Strict TDD regression: origin test failed 403 vs 200 before the handler change, then passed; catalog failed 18 vs 28 before importing; comparison failed missing resource checks and then English VI caveat before fixes; lifecycle/setup regressions failed before implementation. New-module regression contracts live in tests/catalog-expansion.test.ts rather than relying on scratch-only tests.

## Actual final local results

- Full repository suite: 32 passed, 0 failed.
- Catalog validation: 28 projects, 6 categories, 9 use cases.
- Typecheck and production build: passed; build generated 101 static pages.
- HTTP smoke: 95 page requests passed; advisor deterministic 200 and malformed input 400.
- Real Chromium: unconfigured bind reproduced four 403 responses; exact-origin configuration returned four 200 responses across EN/VI with consent off/on. Both locales passed compare navigation/selection/validation, localized caveats, calculator and archived warning. Spoofed cross-origin stayed 403; no pageerror events. Owned servers stopped.

## Sonar / remote boundary

Read-only GitHub PR2 checks and official Sonar API confirmed the existing remote head fails: 48.7% duplicated new lines and C security rating. Official `api/issues/search` for PR2 returned one vulnerability, `githubactions:S7637`, in `.github/workflows/ci.yml`: mutable `pnpm/action-setup@v4`. Resolved the annotated tag through GitHub's official git-ref/tag API and pinned its commit; checkout and setup-node are also pinned to API-resolved commit SHAs. No finding suppression, gate relaxation or exclusions added.

Sonar's server-side duplication/security gate has **not** been rerun for these local-only changes. Removing 18 embedded setup copies reduces actual source duplication, but cannot establish the final <=3% metric without new analysis. Other remote maintainability annotations are not all fixed. No push, merge or deployment is authorized/performed. Existing QA report remains historical evidence, superseded for the local configured advisor flows by this integration verification.
