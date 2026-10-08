# Requirements source review

Checked 2026-10-07 with `date -u +%F`. Sources were retrieved from official docs or project-maintained repositories/wiki, not search snippets. No deployed workloads or image manifests were tested.

## Recorded values and exclusions

- **Immich:** upstream says “RAM: Minimum 6GB, recommended 8GB” and “CPU: Minimum 2 cores, recommended 4 cores”; amd64 and arm64 are listed. GB is conservatively rounded up to whole GiB (6 and 8), explicitly noted rather than silently equating units. Standard ML-enabled stack only; 4GB with ML disabled is not the standard minimum. v3 amd64 ML needs x86-64-v2, which this calculator does not check. Disk remains unknown: library overhead is 10–20%, not a fixed capacity; the typical 1–3 GB Postgres size is not a whole-stack disk minimum.[1]
- **Nextcloud:** stable 35 manual says “minimum of 128MB RAM per process” and recommends “512MB RAM per process”; updater needs 256MB. These are not host or Compose stack requirements. Preserve them in the provenance note, NOT host thresholds. CPU count, disk and image architecture matrix remain unknown. A recommendation for 64-bit CPU/OS/PHP does not certify a Docker image architecture.[2]
- **Uptime Kuma:** official README requires local storage (NFS unsupported) and Node >=20.4 for non-Docker installs. No numeric CPU/RAM/disk floor or Docker architecture matrix was found in that README; preserve unknown fields. The attempted `/wiki/Requirements` URL redirected to wiki Home and was NOT requirements evidence.[3]
- **Vaultwarden:** project wiki documents multi-arch images; its reported compatibility table contains x86_64 and arm64 successes. Record only amd64/arm64, the calculator's supported vocabulary, with reported-compatibility caveat. No numeric resource minima inferred from “lightweight” or the old editorial strings.[4]
- **Grafana:** installation docs state 1 CPU core and 512 MB minimum recommended memory. Record the evaluation floor, converting decimal MB to GiB (`512 * 10**6 / 2**30 = 0.476837158203125`). This is Grafana server only, NOT data source backends or a production target. Small deployment guidance is 2 cores / 2–4 GB; workload tiers and database-host disk ranges are not universal thresholds, so recommended resources/disk/architectures stay unknown.[5]

## Interpretation

Partial evidence can reject a known failed minimum while overall success remains unknown when any required dimension is missing. Per-resource checks expose supplied values, thresholds and unknowns; provenance carries scope and unchecked constraints. Meeting an architecture field means only matching the recorded architecture list, not confirming CPU instructions, OS, storage permissions, image version or dependencies.

Advisor explanations are exact localized catalog summaries/notes, labeled editorial (not upstream-verified benchmarks). Selected use-case descriptions and curated project order replace alphabetical ranking; there is no hidden popularity/performance score. Claude is only an optional bounded reranking preview and cannot change explanations or compatibility facts. No real Anthropic call was made.

## Sources

[1] https://docs.immich.app/install/requirements
[2] https://docs.nextcloud.com/server/stable/admin_manual/installation/system_requirements.html
[3] https://github.com/louislam/uptime-kuma
[4] https://github.com/dani-garcia/vaultwarden/wiki/Which-container-image-to-use
[5] https://grafana.com/docs/grafana/latest/setup-grafana/installation
