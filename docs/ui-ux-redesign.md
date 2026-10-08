# UI / UX redesign

## Direction

An editorial field guide for people choosing software to run on their own server. The primary home surface is **Explore**; detail is **Inspect / Configure**, compare is **Compare**, and advisor is **Configure / Decide**. The implementation is in the existing Next / React stack with no new dependencies, backend changes, schema changes or catalog changes.

The previous screen devoted a viewport to an oversized headline and three stats (including a submission API detail). Category emoji tiles and an additional full listing competed with search. The new home uses a shorter asymmetric introduction, a three-step actionable guide, compact numbered category index, then one actual searchable/filterable catalog. Reset and no-results states are explicit. Search covers names, tags and the current-language summary; category filtering combines with search.

## Visual system

- Light: paper `#f8f7f4`, white surfaces, ink `#242823`, muted ink `#646860`, rules `#d9dcd4`, forest accent `#34614d`.
- Dark: charcoal `#191c19`, raised surface `#222622`, ink `#e6e8df`, muted ink `#b0b7aa`, sage accent `#a6ccb5`. Primary button foreground uses a separate `--on-primary` token instead of white in dark mode.
- Georgia / Times for editorial display headings, Segoe UI / Helvetica Neue / Arial for product body and forms, monospace only for numbered index and deployment code. System fonts avoid remote font requests and render Vietnamese without a separate font download.
- 1240px maximum reading/layout width; 64px desktop outer gutter and 36px mobile; 18–24px card rhythm; 6–8px functional corner radii. Rules, typography and whitespace organize the UI, not gradients or hover rails.
- Cards retain genuine project icons, bilingual summaries, tags and deployment methods. No fit scores or invented metrics.
- Detail keeps readable primary content with a quiet metadata side panel; compatibility resources are stacked label/value rows rather than narrow columns. Advisor separates input from shortlist, with a translated semantic empty state. Compare keeps native multi-select functionality, adds keyboard instructions, a caption, and a focusable scroll region.

## Accessibility / behavior

Visible keyboard focus includes select controls. A bilingual skip link transfers focus to the main landmark. Search has a visible programmatic label and results use a polite status region. Project links include project names in their accessible labels. Controls use 44–46px minimum touch heights. Table overflow is intentionally local, not document overflow. Reduced motion disables transitions and smooth scroll. Light / dark follows the operating-system preference.

All evidence, unknown resource states, warning copy, archived lifecycle warnings, API consent and deterministic fallback remain intact. Native form validation remains intact. No paid services or remote installation scripts were used.

## References, safely inspected

Read repository READMEs (not executed) for:

- https://github.com/pbakaus/impeccable — remove predictable AI-template decoration; distinguish product context from surface design.
- https://github.com/leonxlnx/taste-skill — layout, typography and spacing before ornamental effects.
- https://github.com/affaan-m/ECC/tree/main — test / implement / verify discipline.

Loaded local claude-design, popular-web-designs, TDD and dogfood guidance. Applied original composition rather than cloning a brand. Attempted deeper raw skill paths returned 404; no installer was run.

Anti-slop audit: removed gradients, accent rails, emoji toppers, monument stats, dot-pattern decoration and staggered card entrances. Purposeful platform-font body is the only generic-type tell retained for offline fidelity; display typography is deliberately editorial.

## Verified

Three behavior slices were tested RED then GREEN: labeled filterable live catalog; accessible comparison; translated advisor empty state.

- `npm test`: 37 tests passed.
- `npm run typecheck` and `npm run lint`: passed (both TypeScript checks in this repo).
- `npm run validate:catalog`: 28 projects, 6 categories, 9 use cases unchanged.
- `npm run build`: production build passed, 101 pages generated.
- `tsx scripts/http-smoke.ts`: 95 page requests passed; advisor deterministic fallback and invalid input verified.
- Existing `scripts/browser-qa.cjs`: real Chromium production advisor (both consent states, EN/VI), compare, partial resource calculator, archived warning, configured-origin success and cross-origin rejection passed.
- New `scripts/redesign-browser-qa.cjs`: real Chromium, 360 / 768 / 1440px, light / dark, EN / VI, seven routes per configuration; no document overflow. Keyboard skip link, search, no-results, reset, category filter and local table scrolling passed. Zero page errors.

Run the new suite with a running production server:

```sh
QA_BASE=http://127.0.0.1:4322 PLAYWRIGHT_MODULE=/home/newnol/.hermes/cache/scratch/browser-qa-runtime/node_modules/playwright node scripts/redesign-browser-qa.cjs
```

Set `QA_OUTPUT` to override screenshot location (default is the session scratch directory).

## Genuine screenshot evidence

Before: `/home/newnol/.hermes/cache/scratch/ui-before-1440.png`

After (full-page real Chromium captures):

- `/home/newnol/.hermes/cache/scratch/ui-after-light-1440-home.png`
- `/home/newnol/.hermes/cache/scratch/ui-after-light-360-home.png`
- `/home/newnol/.hermes/cache/scratch/ui-after-dark-768-home.png`
- `/home/newnol/.hermes/cache/scratch/ui-after-dark-360-projects.png`
- `/home/newnol/.hermes/cache/scratch/ui-after-light-1440-compare.png`
- `/home/newnol/.hermes/cache/scratch/ui-after-light-1440-advisor.png`

The script produces home / detail / compare / advisor screenshots for every tested width and theme.

## Limitations / review notes

Screenshot vision analysis returned HTTP 400, so no visual-image review is claimed. DOM, computed layout, genuine screenshots, keyboard behavior and page errors were checked. Parent should visually review the supplied screenshots before publishing. This is not a full WCAG audit or assistive-technology session. Native multi-select remains platform-dependent on mobile; instructions now explain desktop modifier and keyboard selection. Claude provider calls and real external submission webhooks were not exercised; existing fallback and consent behavior were verified. Advisor still requires the existing explicit production origin configuration; this redesign does not change that security policy.
