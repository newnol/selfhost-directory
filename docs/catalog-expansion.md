# Catalog expansion: ten standalone project modules

## Scope and integration

Added exactly **10** project modules below, using existing categories only. Every entry contains Vietnamese and English summaries, operational notes, deployment guidance and backup advice. `data/projects.ts` and `data/categories.ts` are deliberately unchanged: the integrating agent must import and append these modules before they appear in the directory, advisor or generated routes.

| Exact new path / slug | Existing category | Official metadata source | Official installation documentation |
| --- | --- | --- | --- |
| `data/projects/file-browser.ts` / `file-browser` | `media` | [1] | https://github.com/filebrowser/filebrowser/tree/master/docs |
| `data/projects/syncthing.ts` / `syncthing` | `media` | [2] | https://docs.syncthing.net/intro/getting-started.html |
| `data/projects/paperless-ngx.ts` / `paperless-ngx` | `productivity` | [3] | https://docs.paperless-ngx.com/setup/ |
| `data/projects/stirling-pdf.ts` / `stirling-pdf` | `productivity` | [4][11] | https://docs.stirlingpdf.com/ |
| `data/projects/memos.ts` / `memos` | `productivity` | [5] | https://usememos.com/docs/deploy |
| `data/projects/actual-budget.ts` / `actual-budget` | `productivity` | [6] | https://actualbudget.org/docs/install/docker |
| `data/projects/forgejo.ts` / `forgejo` | `productivity` | [7] | https://forgejo.org/docs/latest/admin/installation/docker/ |
| `data/projects/gitea.ts` / `gitea` | `productivity` | [8] | https://docs.gitea.com/installation/install-with-docker |
| `data/projects/beszel.ts` / `beszel` | `monitoring` | [9] | https://beszel.dev/guide/getting-started |
| `data/projects/searxng.ts` / `searxng` | `data-tools` | [10] | https://docs.searxng.org/admin/installation-docker.html |

## Evidence and uncertainty policy

- **Resources remain unknown for all ten entries.** No CPU, RAM, disk or architecture thresholds are asserted. `structuredRequirements` uses `kind: "estimate"` with a bilingual note explaining the absence of measured/verified values; minimum, recommended and architectures are omitted. The official links are installation references, not evidence that a particular host is sufficient. No deployment verification or checked date is claimed.
- **`score: 0` is a neutral legacy schema placeholder, not a rating.** The existing type requires a finite number. Do not display it or use it in recommendations, ordering or quality comparisons. This change adds no scoring UI.
- Both required snippet strings contain **comments only**, explicitly marked unverified in English and Vietnamese, with an official documentation link. They are not runnable shell commands or working Compose configurations. No images, ports, credentials or compose services are invented.
- Stack labels are intentionally limited to technologies supported by upstream metadata. Icons use upstream repository-owner avatars, except Forgejo's official logo. No popularity numbers or subjective quality claims are added.

## Important upstream findings

File Browser's repository is archived; its README states that maintenance ended on 2026-09-01 and there will be no further security fixes. The bilingual summary and notes explicitly warn about this. Its guidance preserves upstream precautions: no direct Internet exposure, independent proxy authentication, command runner disabled and an unprivileged container with narrowly scoped mounts. Inclusion documents the requested project; it is not a recommendation for a new public deployment.[1]

Stirling PDF describes itself as open-core. Its current LICENSE applies MIT outside listed directories, with directory-specific exceptions; the entry does not label the entire distribution simply MIT.[4][11]

Forgejo's upstream README states GPL-3.0-or-later for v9 onward and MIT for earlier versions. Its license string preserves that version scope.[7]

## Verification and parent follow-up

A scratch-only test harness avoids modifying shared tests: `/home/newnol/.hermes/cache/scratch/catalog-expansion.test.ts`. For each slug independently, its schema/uncertainty/bilingual contract was run before creation and failed with `Missing new project entry: <slug>`, then passed after creation. The combined run passed **10/10**. The harness directly imports each new default export and invokes the real `projectSchema` and `validateCatalog` with existing categories; it also checks neutral scores, absent numeric/architecture claims and non-executable snippets. Per-entry RED/GREEN records: `/home/newnol/.hermes/cache/scratch/catalog-expansion-tdd.json`.

Re-run from the repository with Node 22 on PATH:

```sh
node_modules/.bin/tsx --test /home/newnol/.hermes/cache/scratch/catalog-expansion.test.ts
node_modules/.bin/tsc --noEmit --incremental false
```

The full repository suite was also exercised: **16 passed, 2 failed** at that point. Parent integration must address these shared tests:

1. `tests/catalog.test.ts` hard-codes 18 filesystem modules; there are now 28. Update the assertion and aggregate imports together, without losing existing public exports.
2. `tests/advisor-choice.test.ts` expects old Immich editorial wording (`plan storage plus backups`); another agent's requirements update changed those notes. This task does not own that data or test.

No commits, pushes or other remote writes were performed. Shared aggregate/category/test files were not edited. These entries are intentionally not yet included in the served catalog, so an application build would not verify their integration; run the full validation, tests, build and bilingual route smoke checks after adding the imports.

## Sources

[1] https://github.com/filebrowser/filebrowser
[2] https://github.com/syncthing/syncthing
[3] https://github.com/paperless-ngx/paperless-ngx
[4] https://github.com/Stirling-Tools/Stirling-PDF
[5] https://github.com/usememos/memos
[6] https://github.com/actualbudget/actual
[7] https://codeberg.org/forgejo/forgejo/raw/branch/forgejo/README.md
[8] https://github.com/go-gitea/gitea
[9] https://github.com/henrygd/beszel
[10] https://github.com/searxng/searxng
[11] https://raw.githubusercontent.com/Stirling-Tools/Stirling-PDF/main/LICENSE
