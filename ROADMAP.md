# Planning MVP roadmap

## Implemented locally
- Bilingual catalog/project pages, comparison of 2–3 projects, hardware calculator, and filtered advisor.
- Runtime catalog and request validation; partial per-resource checks and dated source provenance.
- Official source review for Immich, Nextcloud, Uptime Kuma, Vaultwarden and Grafana; unknown values deliberately preserved.
- Deterministic editorial tradeoffs and curated use-case ordering, without unsupported quality scores.
- Optional opt-in Claude **reranking preview only**, with validated slug permutations and fail-closed fallback. No live-provider verification claimed.

## Release checks
- Run typecheck, catalog validation, tests, production build and real HTTP smoke.
- Review mobile/keyboard/screen-reader interaction in a browser; server-render/HTTP tests are not interactive accessibility certification.
- Keep legacy Compose/scripts visibly unverified. No stack generation or automated deployment in this release.

## Next evidence work
- Version-pinned source reviews for remaining catalog projects; validate image manifests separately from general 64-bit OS recommendations.
- Model workload/resource scope (per process vs host, database/rendering/ML variants), explicit units and field-level provenance before adding more thresholds.
- Define multi-app host headroom, storage sizing and benchmark methodology before offering capacity guarantees.
- Periodic stale-source review and link checks; localization review of source notes.

## Before enabling paid AI in production
- Shared durable rate limits, per-user quotas, spend caps, abuse monitoring and privacy review.
- Real credentialed transport smoke with an explicitly selected supported model; keep deterministic fallback tested.
- Only consider bounded source-cited explanations after grounded-output evaluation and review. Current preview only changes order.

## Outside MVP
Executable stack generation, deployment orchestration, extra catalog expansion, remote release/push, and license selection require separate approval.
