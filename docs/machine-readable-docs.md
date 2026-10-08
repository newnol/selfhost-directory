# Machine-readable public catalog

## Public contract

Canonical origin: `https://selfhost.io.vn` (these are intended stable URLs; local verification does not claim production publication).

| Route | Status | Content-Type / redirect |
| --- | --- | --- |
| `/llms.txt` | 200 | `text/plain; charset=utf-8` |
| `/llm.txt` | 308 | Location: `https://selfhost.io.vn/llms.txt` |
| `/llms-full.txt` | 200 | `text/plain; charset=utf-8` |
| `/en/projects/<catalog-slug>.md` | 200 | `text/markdown; charset=utf-8` |
| `/vi/projects/<catalog-slug>.md` | 200 | `text/markdown; charset=utf-8` |
| Invalid locale on a known markdown route | 404 | `text/plain; charset=utf-8` |
| Unknown/case-mismatched/malformed markdown slug | 404 | Existing Next not-found HTML fallback |

All successful text responses include `X-Content-Type-Options: nosniff`. GET handlers allow Next to supply HEAD responses. Only exact catalog slugs and locales `en` / `vi` are accepted; there is no slug normalization.

## Catalog and privacy

The renderer imports the same validated `data/projects` export used by the UI: **28 projects**, **56 localized documents**, **56 markdown links** in the index and **56 complete localized sections** in the full document. It explicitly selects public metadata, translated summaries/notes/deployment guidance, license labels, lifecycle, official source/docs links and structured requirements/provenance. It does not read submissions, environment variables, webhook configuration or user records. Compose/setup snippets are deliberately excluded, including placeholder credentials.

Missing CPU/RAM/disk/architecture/source/date values remain unknown. Estimates remain estimates; a checked requirements source is not runtime verification. Lifecycle defaults to unknown where not recorded, not implicitly active. License and lifecycle verification dates are not invented. Guidance is marked `Deployment verification: unverified` and directs readers to current upstream documentation.

Optional pilot links appear only when a project's `installers/<slug>/v1/metadata.json` and `install.sh` exist and the manifest validates. Currently only Uptime Kuma has these artifacts. Its status, SHA-256, checked date, validation limits and platform caveats are copied from that manifest. No PowerShell artifact or unsupported-platform success claim is advertised. Reading manifest/artifact existence requires the Node filesystem runtime and deployed installer files. `next.config.ts` explicitly traces all three pilot artifacts through `outputFileTracingIncludes`; the production smoke checks all 30 emitted machine-document traces contain their resolved source paths. Invalid/unreadable optional JSON is omitted rather than taking the public document offline.

## Next route design

Use **literal** `<slug>.md/route.ts` handlers under `app/[locale]/projects/(machine-docs)/`. The route group is absent from public URLs. Each three-line wrapper delegates to the shared `createProjectMarkdownHandler` factory in `lib/machine-docs.ts` and supplies its exact catalog slug; no repeated handler logic or duplication exclusions.

Do not add `[slug].md/route.ts`: Next's dynamic route regex treats that segment as a generic dynamic match, colliding with the existing `[slug]/page.tsx` instead of enforcing a `.md` suffix. Literal markdown routes take precedence without touching HTML pages, rewrites, middleware, robots or sitemap. When adding/removing catalog projects, add/remove the matching literal route wrapper; the catalog itself remains the content source of truth.

## Verification performed

Strict test-first cycles observed missing index/module, missing document renderers, missing HTTP routes and missing installer evidence before their implementation.

Commands (Node 22.16.0 on PATH):

```sh
node --import tsx --test tests/machine-docs.test.ts
npm run typecheck
npm run build
npm test
npm run start -- --hostname 127.0.0.1 --port 3147
```

Integration verification: `npm test` (71 tests), `npm run typecheck`, `npm run validate:catalog`, `npm run build` (107 static outputs), `npm run test:deployment-docs`, and the existing HTTP smoke. The deployment-docs smoke verifies 30 emitted traces, 56 byte-exact localized documents, index/full/alias, ten invalid-route 404s, three source-byte-exact downloads and HEAD responses with MIME/attachment/immutable/nosniff headers, and checksum/manifest consistency. It binds loopback on an ephemeral port and terminates its owned server in `finally` (SIGKILL fallback), then rebinds the port to verify listener cleanup. CI runs it after build. These are local production-build checks, not a Vercel publication or real Docker deployment.

Real local production-server HTTP enumeration verified:

- 56 localized markdown GETs: 200 and exact markdown MIME.
- `/llms.txt` and `/llms-full.txt`: 200 and exact plain-text MIME; full body contained 56 localized sections.
- `/llm.txt`: 308 and exact canonical absolute Location.
- Six invalid paths: `/fr/projects/immich.md`, `/EN/projects/immich.md`, `/en/projects/missing.md`, `/en/projects/immich.md.md`, `/en/projects/Immich.md`, `/en/projects/[slug].md`: all 404.
- Existing `/en/projects/immich`: 200 HTML, unchanged route behavior.

This work is delivered as a draft stacked feature PR; no production merge or publication is part of verification.
