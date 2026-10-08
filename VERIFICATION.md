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

## Follow-up: source-backed partial planning (2026-10-07)

Test-first RED/GREEN observed for partial checks (undefined checks before implementation), static threshold UI (missing data-resource rows), curated use-case order (alphabetical order failed), source-backed requirements (undefined provenance), reranking preview (missing API flag/consent label), and rendered advisor tradeoffs/checks/provenance (missing component). Source claims and exclusions are recorded in `docs/requirements-provenance.md` with a citation ledger. Nextcloud per-process memory was deliberately not turned into total host RAM.

Real follow-up verification: `pnpm typecheck` passed; `pnpm validate:catalog` returned 18 projects / 6 categories / 9 use cases; `pnpm test` returned 18/18 passing; `pnpm build` compiled and generated 81/81 static pages; HTTP smoke passed 75 enumerated page requests plus an additional Immich evidence-page fetch and partial-evidence API assertions; invalid request 400. `git diff --check` passed. No live Claude call, deployment, push or license change.

Exact local rerun:

```sh
export PATH="/home/newnol/.hermes/cache/scratch/node-v22.16.0-linux-x64/bin:$PATH"
cd /home/newnol/.hermes/cache/scratch/selfhost-mvp-review
pnpm typecheck && pnpm validate:catalog && pnpm test && pnpm build && pnpm exec tsx scripts/http-smoke.ts
git diff --check
```

## Limits / unverified

- Claude transport tests are mocks (permutation validation, budgets, opt-in, failure and abort). No credentials supplied; no real Anthropic success claimed.
- Superseded by the follow-up source review below: five projects now carry scoped provenance; numeric thresholds exist for Immich/Grafana and architecture evidence for Vaultwarden. Other values deliberately stay unknown.
- Preserved Compose/bash samples have NOT been deployed; unverified warnings added. No executable generation.
- Process-local request limit is not shared/durable on serverless. Paid integration disabled unless explicit acknowledgement and config; README documents required production mitigations.
- UI render tests and HTTP smoke do not substitute for interactive browser/accessibility testing.
- pnpm reported ignored build scripts for esbuild/sharp; installed platform binaries nevertheless ran tests and production build successfully. No scripts enabled globally.
- CI configuration is added and local equivalent commands passed; remote CI has not run. Repository license selection left unchanged.
