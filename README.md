# selfhost.io.vn

Bilingual (Vietnamese/English) Next.js 16 / React 19 self-hosting planning directory.

## Run and verify

Node.js 22+, pnpm 10.34.6 (see `packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm validate:catalog
pnpm typecheck
pnpm test
pnpm build
pnpm exec tsx scripts/http-smoke.ts
```

Browse `/vi` or `/en`. Existing category, project, SaaS-alternative and submission routes remain.

## Planning MVP

- Catalog: 18 project modules in [data/projects](data/projects), [categories](data/categories.ts), [use cases](data/use-cases.ts). `data/projects.ts` preserves public exports and validates the catalog at runtime. CI also validates it explicitly.
- Project pages: hardware calculator (CPU cores, **available** RAM/disk in GiB, amd64/arm64). Results: below minimum, minimum, recommended, unknown or architecture mismatch. Meeting a threshold is not a guarantee. Unknown fields never mean compatible; no headroom, GPU, storage growth or combined-stack calculation is implied.
- Compare: `/en/compare?projects=immich,jellyfin` (also `/vi/compare`), 2–3 distinct catalog slugs; selector supports repeated `projects` parameters.
- Advisor: `/en/advisor`, `/vi/advisor`, `POST /api/advisor`. Structured catalog/use-case/deployment filters, deterministic slug ordering, at most three choices, with unknown caveats. No free-form chat, stack builder, scanner, troubleshooter, cost planner or executable Compose generation.

### Evidence policy

Original requirements strings are **unverified editorial estimates**, not parsed into numeric evidence. All 18 current projects intentionally have unknown structured requirements/architecture pending source review. Optional `structuredRequirements` has `minimum`/`recommended` (`cpu`, `ramGiB`, `diskGiB`), `architectures`, and mandatory provenance (`estimate` with note, or `documented` with HTTPS source, checked date and scope note). Missing fields remain unknown. Documented means a cited documentation claim, not a tested deployment. Scores survive only as legacy data for backward compatibility; not shown or used for decisions.

Existing Compose/bash examples are unverified and may be incomplete/outdated. Replace placeholder secrets, pin versions, review privileged access/ports, HTTPS and backups, and consult upstream docs. These are preserved examples, not generated or tested deployments.

## Optional Claude (server only, disabled by default)

No API key is needed for deterministic fallback. Claude can **only reorder the already filtered max-three choices**: provider text, resource claims, links, commands and additional projects are never shown. User must opt in on the form. Server must set all of:

```text
ADVISOR_CLAUDE_ENABLED=true
ADVISOR_ALLOW_PROCESS_LOCAL_LIMITS=true
ANTHROPIC_MODEL=<explicit model supported by your account>
ANTHROPIC_API_KEY=<server secret, never NEXT_PUBLIC>
```

The acknowledgement explicitly accepts the limitations below; a key alone does not enable paid calls. Input is strictly validated (no free-form prompt), maximum 8192 request bytes and 12000 provider payload characters; 256 output tokens, 5-second abort deadline, bounded 16384-byte provider response. Invalid output, non-catalog IDs, duplicates, network errors and timeout fall back safely. Only selected catalog facts and supplied hardware are sent to Anthropic; never submit secrets. No provider error or key is returned/logged.

**Abuse limits:** 30 requests/minute globally per warm process, including invalid JSON; spoofed client IP headers are not trusted. This is NOT a shared/durable rate limit or global spend cap: cold starts and multiple serverless instances reset/multiply it, and a noisy user can exhaust a local process. Keep Claude disabled on public serverless deployment until deploying a trusted gateway/shared limiter, authentication/bot protections and provider spend limits. Origin checks discourage browser cross-site requests but do not authenticate clients. CI provider tests use mocked transport, not real Claude credentials.

## Submission flow (unchanged)

Set `SUBMISSIONS_WEBHOOK_URL` to forward `/api/submit-project` submissions to your review endpoint. Without it, submissions are accepted and written to server logs, not a durable production queue.

## Roadmap

1. Review upstream documentation and add scoped, dated resource/architecture evidence one project at a time.
2. Independently audit legacy deployment examples; do not mark verified without executing isolated tests.
3. Shared/durable abuse controls and spend budgets before public paid advisor access.
4. Improve comparison accessibility and browser end-to-end coverage.

Out of this MVP: stack builder, executable deployment generation, troubleshooting, server scanning and cost planning. Repository license selection remains a maintainer decision; no LICENSE is chosen here. See [CONTRIBUTING.md](CONTRIBUTING.md).
