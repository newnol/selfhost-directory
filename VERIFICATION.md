# Local verification — planning MVP

Environment: local Node v22.16.0 (downloaded without sudo), pnpm 10.34.6; locked Next 16.2.6 / React 19.2.6.

## Test-first evidence

Executed new tests before implementation and observed RED:
- Catalog module split: ENOENT `data/projects` before split.
- Runtime schema, compatibility, compare route, advisor engine/API/UI: missing feature module failures before implementations.
- Compatibility follow-up: expected `recommended`, received `unknown`; invalid host did not throw. Implemented validated threshold/architecture engine; GREEN.
- Project UI: missing `name="cpu"` before calculator/warnings and score removal; GREEN after changes.
- Claude transport: expected `claude-ranked`, received `deterministic` before opt-in integration; GREEN after validated permutation-only handling.
- Structured provenance regression: invalid `2026-02-31` accepted; RED, then calendar validation fix, GREEN.

Final real execution after formatting:

```text
pnpm install --frozen-lockfile: lockfile up to date
pnpm validate:catalog: Catalog valid: 18 projects, 6 categories, 9 use cases
pnpm typecheck: tsc --noEmit, exit 0
pnpm test: tests 15, pass 15, fail 0
pnpm build: Compiled successfully in 7.8s; generated 81/81 static pages
pnpm exec tsx scripts/http-smoke.ts:
HTTP smoke passed: 75 page requests; advisor fallback 200 (3 unknown choices); invalid input 400
git diff --check: exit 0
```

Smoke starts/stops the actual production Next server; both languages, every existing catalog/category/use-case page, advisor, submission page and compare query were fetched. Submission API was not modified or posted to. No GitHub remote writes.

## Limits / unverified

- Claude transport tests are mocks (permutation validation, budgets, opt-in, failure and abort). No credentials supplied; no real Anthropic success claimed.
- All current structured resource/architecture values remain unknown until source review. Numeric threshold test fixtures are explicitly not catalog evidence.
- Preserved Compose/bash samples have NOT been deployed; unverified warnings added. No executable generation.
- Process-local request limit is not shared/durable on serverless. Paid integration disabled unless explicit acknowledgement and config; README documents required production mitigations.
- UI render tests and HTTP smoke do not substitute for interactive browser/accessibility testing.
- pnpm reported ignored build scripts for esbuild/sharp; installed platform binaries nevertheless ran tests and production build successfully. No scripts enabled globally.
- CI configuration is added and local equivalent commands passed; remote CI has not run. Repository license selection left unchanged.
