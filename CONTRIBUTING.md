# Contributing

Use Node.js 22+ and pnpm 10.34.6. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. Both `/vi` and `/en` must stay functional.

## Content layout

- Add/edit one typed module in `data/projects/<slug>.ts` and import it in `data/projects.ts`.
- Types: `data/types.ts`; categories: `data/categories.ts`; use cases: `data/use-cases.ts`.
- Existing exports from `data/projects.ts` are public compatibility surface.
- Slugs must be unique lowercase/hyphen identifiers. Categories and use-case references must exist; all bilingual fields and HTTPS source/docs links are required.
- Include summaries, notes, deployment steps, backups and translations. Catalog licenses are descriptive claims, not a license for this repository; check upstream licensing before correcting entries.

## Requirements and deployment honesty

Do not convert prose estimates into verified CPU/RAM/disk facts. Omit `structuredRequirements` or any unknown field until checked. Optional numeric resources are positive numbers in cores/GiB. Recommended cannot be below minimum. Every structured record needs provenance:

```ts
structuredRequirements: {
  provenance: { kind: "estimate", note: "Explain workload and uncertainty in both languages where relevant" },
  // minimum/recommended/architectures omitted when unknown
}
```

For documentation-derived values, use `kind: "documented"`, a real HTTPS `source`, valid `checkedAt` (`YYYY-MM-DD`) and a `note` describing version/workload scope. Never use this example as evidence. A documentation citation is not deployment verification. Update tests for uncertainty/threshold behavior. Legacy `requirements` is an unverified editorial string; `score` is retained only for backwards compatibility and must not appear in decision UI or rankings.

Existing `deploySnippets` are unverified examples, NOT working guarantees. Preserve visible warnings; do not add secrets, assume `latest` is reproducible or create executable generation. Prefer upstream instructions; independent sandbox testing is required before any verification claim.

## Code and tests

Strict TypeScript, plain CSS, no UI framework. Prefer server components; interactive calculators/forms may be client components. Keep provider keys and network logic server-side. TDD: add one behavior test, observe RED, implement, verify GREEN, refactor. UI tests render real React markup; provider tests mock only network transport.

```sh
pnpm validate:catalog
pnpm typecheck
pnpm test
pnpm build
pnpm exec tsx scripts/http-smoke.ts
```

All commands must pass; CI repeats them. Add both languages, invalid inputs and unknown/evidence cases. Do not assert real Claude success from mocks. Read README abuse-limit limitations before enabling paid calls. Submit small PRs with evidence URLs, scope, tests and remaining unknowns.
