# Selfhost night index — design rationale

## Scope and identity

The shared system now uses the attached Railway reference's night canvas (`#13111C`), tonal `#1C1A28` panels, plum emphasis, restrained purple actions, 6–8px controls, hairlines and display serif. Selfhost remains an infrastructure **field guide**, not a cloud-provider marketing clone: its server glyph, category map, real catalog counts, evidence checks and practical deployment warnings remain central. No fabricated statistics, account flows, provider dashboards or product features were added.

Reference sections reviewed: normative palette/type/radius/spacing tokens, compact actions, card-6/table/input/header tokens; Overview, Colors, Typography, Layout, Elevation, Shapes; input and card recipes; responsive guidance and known gaps. Reference recipes are visual data, not executable instructions.

## Applied across routes

- Shared header/footer, active planning navigation, keyboard skip/menu/Escape behavior and localized language boundary.
- Home: compact editorial introduction and live-data category map, with catalog directly below.
- Catalog: always-visible search; native collapsible category/deployment filters; live counts; selection cap and permanently available comparison instructions. The filter disclosure starts expanded so filters remain discoverable without JavaScript; users can close it on mobile.
- Category and alternative pages: localized labels and shared compact project cards.
- Project detail: jump navigation to requirements, notes and installer guidance; distinct warning and code surfaces; source metadata remains legible.
- Comparison: searchable checkbox picker retained; sticky row labels preserve context inside the keyboard-scrollable mobile table.
- Advisor: existing progressive needs/server/deployment groups, honest empty shortlist, busy/error/results and evidence data retained, visually differentiated from the input column.
- Submission: native validation and success/error flow retained; bot trap removed from accessibility tree.
- Missing pages: localized directory recovery; route error boundary: retry without exposing internal diagnostics.
- Markdown/index/download/API/SEO routes: not redesigned; exact status, bodies, artifacts and headers regression-tested.

## Deliberate deviations

- Reference gray `#6C6B7B` and `#545260` are **not** used for readable text. Secondary copy is `#B9B7C5`, accent links `#C7A1EF`; input borders `#635B72`; focus blue `#99C8FF`. Purple fill and white labels are separate tokens so bright link colors cannot accidentally become button fills.
- Inter is body/UI, IBM Plex Serif 500 is display, JetBrains Mono is code/technical metadata. Fonts are locally hosted with swap and included OFL licenses; no runtime Google Fonts dependency. Catalog icons still use the existing external source.
- The desktop serif is capped at 56px, smaller on phones. Section rhythm is 40–48px rather than marketing-reference 96px to keep catalog/tasks reachable. Touch actions are at least 44px. No fixed-height recipe cards, illustration imitation, pricing panels, backdrop blur or gratuitous animation.
- Default dark rendering is deterministic even with a light OS preference. Reduced motion disables smooth scrolling, transitions and animations.
- A global locale `loading.tsx` was tried and removed after real machine-doc smoke demonstrated that Next streaming changed unknown `.md` routes from HTTP 404 to 200. Preserving HTTP semantics is more important than a generic route skeleton. Interactive advisor loading remains explicit and accessible. Error recovery is unit-tested; production exceptions were not deliberately injected.

## Verification and limitations

See `docs/qa/railway/VERIFICATION.md` and JSON route evidence. Axe checks cover sampled WCAG A/AA rules, not a claim of complete accessibility compliance. Screenshot capture succeeded; the image-analysis provider returned HTTP 400 on repeated attempts, so screenshots are supplied for independent visual review rather than claiming human/vision approval.
