# Official requirements enrichment

Checked on **2026-10-07 UTC**. Live clock observations: `2026-10-07T16:28:25Z` before retrieval and `2026-10-07T16:30:01Z` after the source sweep. These are retrieval dates, not publication dates. Only the nine assigned project modules and this document are in scope; no shared schemas, aggregate catalog, tests or deployment snippets were edited.

## Recorded evidence and exclusions

- **Immich:** upstream lists minimum 2 cores / 6 GB and recommended 4 cores / 8 GB, with amd64 and arm64 platforms. The 4 GB alternative disables machine learning. From v3 the amd64 ML container needs x86-64-v2. Keep the existing conservative 6/8 GiB thresholds; total library disk is unknown. PostgreSQL's typical 1–3 GB files are not a whole-host disk minimum.[1]
- **Nextcloud:** the checked stable manual identifies itself as Nextcloud 35. Its 128 MB minimum / 512 MB recommended RAM is **per process**, with 256 MB for the updater, not host RAM. All host thresholds and image architectures stay unknown.[2]
- **Uptime Kuma:** the current README requires local volume/directory storage and explicitly excludes NFS. Non-Docker Node.js >=20.4 is a software prerequisite, not hardware sizing. Numeric host requirements remain unknown. The checked README demonstrates image `:2`, while the pre-existing catalog snippets use `:1`; snippets are unchanged and should be reviewed separately.[3]
- **Vaultwarden:** the project-maintained multiarch wiki includes reported x86_64 and arm64 installations, confirmed in the full raw compatibility table. Preserve amd64/arm64 as reported platforms, not an exhaustive architecture matrix or a fresh image-manifest check. No numeric host thresholds were found in this source.[4][12]
- **Grafana:** the page lists 1 CPU core and 512 MB as minimum recommended resources, then scopes sizing to the Grafana server process, excluding data sources. Retain the CPU evaluation floor but remove the prior process-RAM-to-host-RAM threshold. The small-production RAM ranges and database-host disk tiers are workload-specific, not universal host sizing.[5]
- **Netdata:** add documented partial provenance, with all host thresholds unknown. Official figures describe an agent footprint; the roughly 4 GiB disk figure is a configurable default for metrics and metadata, not a minimum disk size. Collection volume, sampling, ML, database tiers and retention affect usage.[10]
- **Jellyfin:** add documented partial provenance, without numeric thresholds. CPU/RAM recommendations are linked to integrated or dedicated GPU scenarios. The shared 100 GB SSD recommendation is explicitly for OS, Jellyfin files and transcoding cache; it is not a complete media-library capacity budget.[7]
- **Open WebUI:** add amd64/arm64 based on explicitly documented Linux x86_64/ARM64 platform support, not image-manifest inspection. Standard images bundle speech-to-text and embedding models, while slim externalizes optional features. Image download sizes are not host disk minima; numeric host sizing stays unknown.[8]
- **Ollama:** add amd64/arm64 based on official Linux binary packages, not a Docker manifest. The FAQ distinguishes model placement in system RAM, GPU memory or both, and describes context/concurrency effects. Model-specific or GPU-dependent memory figures are not universal host minima; no numeric host thresholds are recorded.[13][9]

## Units and localization

A calculation tool confirmed `512 * 1,000,000 / 2^30 = 0.476837158203125 GiB`, but that conversion does not justify a host RAM threshold for Grafana. Under a decimal interpretation, Immich's 6 GB and 8 GB are approximately 5.587935447692871 and 7.450580596923828 GiB. The existing 6/8 GiB values are explicitly conservative upward rounding, not exact conversions; upstream does not define its GB convention.

All nine entries now have natural Vietnamese and English editorial caveats in the supported `notes.vi` / `notes.en` fields. Legacy `requirements` strings no longer advertise unsupported numeric host sizing. No schema or application behavior was changed.

**Schema follow-up for the parent:** `provenance.note` currently accepts only a non-empty string, in a strict object. It cannot hold bilingual objects or additional localized fields. Keep its English evidence text for compatibility and use bilingual editorial notes for now. A future migration could make evidence notes bilingual (with a legacy-string adapter) and add explicit evidence scope such as `host`, `process`, `database`, `binary-platform` or `reported-image-platform`, plus multiple source URLs and version context. Update validation, API output and evidence renderers together; do not silently concatenate two languages or treat binary architecture evidence as verified Docker compatibility.

## Retrieval limitations

The initial Netdata installation/required-resources URL failed extraction; the current resource-utilization page succeeded instead.[6][10]

The first attempted Vaultwarden raw URL (`https://raw.githubusercontent.com/dani-garcia/vaultwarden/wiki/Which-container-image-to-use.md`) failed extraction. The correct wiki raw URL succeeded, and a direct HTTPS read returned the full reported compatibility table after the extractor omitted it.[12]

Jellyfin extraction stopped partway through the dedicated-GPU section. No claims from that omitted tail are used. Some other extracts were abbreviated; only returned text or the explicitly retrieved raw table supports the recorded claims.

## Verification

- Individual `projectSchema` and `requirementsSchema` validation: **all nine entries passed**, including exact checked date, no fabricated disk minima, and no host RAM minima outside Immich.
- Final targeted run (advisor-choice, documented-requirements and validation): **4 passed**, including the retained Immich storage/backup wording.
- `git diff --check`: passed. Citation-ledger verification: passed (one retrieved Netdata Docker page was unused).
- `npm run typecheck`: passed.
- `npm run validate:catalog`: passed for the registered catalog (18 projects, 6 categories, 9 use cases at that run).
- Full test run initially passed 16/18: the Immich prose assertion needed its existing storage/backup phrase retained (fixed in this owned file); the other failure was the concurrent expansion's 28 module files versus an old expectation of 18, outside this ownership scope.
- No commit, push, shared aggregate changes or behavior implementation. TDD was not applicable to this data-only enrichment.

## Sources

[1] https://docs.immich.app/install/requirements
[2] https://docs.nextcloud.com/server/stable/admin_manual/installation/system_requirements.html
[3] https://github.com/louislam/uptime-kuma
[4] https://github.com/dani-garcia/vaultwarden/wiki/Which-container-image-to-use
[5] https://grafana.com/docs/grafana/latest/setup-grafana/installation
[6] https://learn.netdata.cloud/docs/netdata-agent/installation/required-resources
[7] https://jellyfin.org/docs/general/administration/hardware-selection
[8] https://docs.openwebui.com/getting-started/quick-start
[9] https://docs.ollama.com/faq
[10] https://learn.netdata.cloud/docs/netdata-agent/resource-utilization
[12] https://raw.githubusercontent.com/wiki/dani-garcia/vaultwarden/Which-container-image-to-use.md
[13] https://docs.ollama.com/linux
