# Planning MVP browser QA

Tested 2026-10-07 16:28–16:38 UTC, local production `next start --hostname 0.0.0.0 --port 4312` (Next.js 16.2.6), repository `/home/newnol/.hermes/cache/scratch/selfhost-mvp-review`, HEAD `f9f367bad857fb4818790992ed517fc60f10069e`. Used existing `.next` build; source files were concurrently being enriched by other agents, so results describe the running production artifact, not their unfinished edits. Readiness: GET `/en/advisor` returned HTTP 200.

## Summary

Three observed issues: one High functional blocker, one Medium presentation issue, one Low localization issue. Calculator and native comparison selection work. Valid advisor submissions do not work in this local bind configuration; successful deterministic fallback and advisor-to-compare navigation remain blocked, not passed. Remote PR2 is draft/open and **CI is not fully green**.

Real Chromium interaction was performed through Playwright (headless, `--no-sandbox`), using DOM selectors, form fills, actual button clicks and native select changes. The provided browser helper could not launch Chrome because the Linux sandbox failed (`credentials.cc:131`, Permission denied); installing Playwright Chromium outside the repository recovered real-browser testing. No mocked API responses or application edits were used.

## Coverage and actual results

| Flow | Result |
|---|---|
| EN and VI advisor pages | Localized headings, hardware fields, filters, optional Claude consent and submit buttons render. |
| Empty advisor submission, both locales | Browser blocks submission; CPU `validity.valid=false`, `Please fill out this field.` |
| Negative CPU (-1), RAM 8 GiB, disk 100 GiB | Browser blocks submission; `Value must be greater than or equal to 0.01.` |
| Valid advisor: 4 CPU, 8 GiB RAM, 100 GiB disk, amd64, default filters | Both locales POST `/api/advisor` returns 403; localized generic error rendered, no suggestions. |
| Same valid submission with Claude consent checked | Both locales return 403 again; deterministic fallback cannot be verified through this production UI. |
| EN compare: select Immich + Jellyfin in native multiple select, click Compare | Navigates to `/en/compare?projects=immich&projects=jellyfin`; table headers are Immich and Jellyfin and rows render. |
| EN compare: select only Immich, click Compare | Table absent; alert `Choose 2–3 distinct projects.` |
| Immich calculator, EN and VI, empty submit | Required-field browser validation blocks submission. |
| Immich calculator: 1 CPU, 1 GiB RAM, 1 GiB disk, amd64 | Overall below-minimum status; CPU/RAM individually below minimum, disk unknown, architecture recognized. |
| Immich calculator: 8 CPU, 16 GiB RAM, 1000 GiB disk, amd64 | CPU/RAM recommended checks pass, disk remains unknown, overall unknown (correct conservative behavior). |
| Same calculator inputs, switch architecture to arm64 and click Check | Supported architecture recognized; overall stays unknown because disk evidence is missing. |

Console captured four failed-resource 403 errors, one for each valid advisor submission. No `pageerror` events were captured in the completed run. Native validation message language follows browser locale (English here), not the VI route; this was not counted as an application bug.

## QA-1 — Same-origin advisor POST rejected by origin check

**High / Functional / blocks advisor acceptance on tested local production configuration**

- URLs: `http://127.0.0.1:4312/en/advisor` and `/vi/advisor`.
- Files: `lib/advisor-server.ts:60–64` compares Origin directly with `new URL(request.url).origin`; `components/advisor-form.tsx:33–48` issues same-origin fetch and converts non-OK responses into generic error.
- Reproduce: start production server bound to `0.0.0.0`, open either route via `127.0.0.1`, fill 4/8/100/amd64, click Find projects / Tìm dự án. Repeat after checking optional Claude consent.
- Expected: same-origin valid requests return catalog suggestions, with deterministic behavior when optional provider reranking is unavailable.
- Actual: HTTP 403; EN `Unable to process this request. Check inputs or try again later.`; VI `Không xử lý được yêu cầu. Kiểm tra dữ liệu hoặc thử lại sau.` No comparison link appears.
- Independent HTTP confirmation: POST with Origin `http://127.0.0.1:4312` returns `{"error":"origin"}`. Access via localhost with matching localhost Origin also returns the same 403. This implicates external-origin versus server-request URL normalization, but the exact internal request origin was not instrumented; no source changes were made.
- Browser response-body extraction timed out in Playwright despite the response status and UI error being observable. The curl response independently confirms the server body; do not confuse that harness limitation with the application bug.
- Scope: confirmed for this local production bind; not evidence that the deployed Vercel host has the same failure. Do not weaken origin validation blindly; test the actual public-origin/proxy behavior.

## QA-2 — Comparison shows raw structured-requirements JSON

**Medium / UX-content / nonblocking**

- URL after actual selection: `/en/compare?projects=immich&projects=jellyfin`.
- File: `app/[locale]/compare/page.tsx:71–76`, `JSON.stringify(p!.structuredRequirements)`.
- Reproduce: select Immich and Jellyfin and submit the comparison form.
- Expected: readable CPU/RAM/disk/architecture checks and linked provenance, consistent with the project calculator.
- Actual: Hardware compatibility cell prints a large unformatted JSON object containing `minimum`, `recommended`, `architectures`, `provenance`, source URL and long note. Jellyfin's missing evidence shows a readable Unknown sentence. The selection and comparison function still work.

## QA-3 — Vietnamese evidence caveat remains English

**Low / Localization-content / nonblocking**

- URL: `/vi/projects/immich`.
- Files: `components/resource-checks.tsx:23` renders `provenance.note` verbatim; the Immich note originates in `data/projects/immich.ts`.
- Reproduce: open VI Immich detail, submit hardware calculator, read `Nguồn chính thức` evidence paragraph.
- Expected: Vietnamese-readable caveats about minimums, machine-learning exceptions, SSD/database storage and unknown disk sizing.
- Actual: labels and result statuses are Vietnamese, but the long evidence paragraph begins `Upstream: 2 cores / 6GB minimum, 4 cores / 8GB recommended...` and remains entirely English. This includes important limitations, not only a proper name or source quotation label.

## PR2 read-only CI snapshot

Read with `gh pr checks 2 --repo newnol/selfhost-directory` before and after testing. PR is OPEN, draft; remote head matches local HEAD.

| Check | Actual status | Link |
|---|---|---|
| SonarCloud Code Analysis | **fail**, 20s | https://sonarcloud.io/dashboard?id=newnol_selfhost-directory&pullRequest=2 |
| verify | pass, 32s | https://github.com/newnol/selfhost-directory/actions/runs/37592379390/job/112696715434 |
| CodeRabbit | pass | CLI supplied no URL |
| Vercel | pass | https://vercel.com/newnolclolabs-projects/selfhost-directory/33AiV8Z9L3Kt7m9CEUFiy9RtB1SK |
| Vercel Preview Comments | pass | https://vercel.com/github |

Read-only check-runs API confirms Sonar Quality Gate failed: **48.7% duplication on new code (required ≤3%)** and **C security rating on new code (required ≥A)**. Security findings were not adjudicated in this browser QA task; a failing rating is not itself proof of an exploitable vulnerability. Vercel deployment success and Actions verify success do not override the failed quality gate.

## Evidence, boundaries and cleanup

- Raw DOM text, validation states, URLs and response statuses: `/home/newnol/.hermes/cache/scratch/planning-browser-evidence.json`.
- Executed browser harness: `/home/newnol/.hermes/cache/scratch/planning-browser-qa.cjs`.
- Full browser execution log: `/home/newnol/.hermes/cache/scratch/planning-browser-output.log`.
- No screenshots/visual-layout conclusions: scope was text-first functional verification.
- Not tested: live Claude provider success, Vercel UI, mobile layout, every catalog project, full browser accessibility audit, project-submission endpoint (outside planning hardware-submission scope).
- Test server was stopped. Initial process-manager kill was incomplete; terminated only the owned npm/server process tree and verified port 4312 no longer listens and curl reports HTTP 000.
- No merge, deployment, commit, remote write, or shared application-file modification. Repository deliverable owned by this task: this report only. Concurrent catalog modifications belong to other agents.
