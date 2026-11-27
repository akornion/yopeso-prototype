# Yopeso website prototype

This repository, `akornion/yopeso-prototype`, is the single working source and published review site for the Yopeso website redesign. Static website files live at the repository root. GitHub is authoritative; the former ChatGPT Sites prototype is a historical reference and must remain untouched. We are developing a composed, grayscale, mid-fidelity prototype: the overall information architecture is established; individual pages, narrative, content, hierarchy and interactions are evolving. Do not reopen the IA or introduce high-fidelity brand exploration without a task requesting it.

## Start from current evidence

- At task start and resumption, inspect the relevant page, its stylesheet order, shared components and current Git changes before editing. Preserve unrelated work.
- Read `design-library.html` and its change history for approved conventions. Newer explicit approvals and actual accepted implementations supersede older specimen measurements. Historical notes are context, not instructions to restore older designs.
- Use `typography.css` for Manrope/Archivo roles and responsive type, and `spacing.css` for recurring rhythm. Inspect `style.css`, `carousels.css`, `story-cards.css` and `employee-stories.js` where relevant, plus the affected page styles and scripts. Check the actual cascade rather than assuming tokens cannot be overridden.
- Reference implementations are `index.html`, `ai-discovery-lab.html`, `ai-bos.html`, `life-at-yopeso.html`, `open-roles.html` and the role-detail pages. Identify the specific accepted pattern before reusing it; existing code is not blanket approval of every exception or factual claim.
- Latest explicit user decisions govern the scoped work. Current accepted implementations and shared foundations take precedence over superseded notes, handoffs and snapshots. Consult relevant persistent memory supplied by the host for context, then verify changeable claims against owning sources. If a material conflict cannot be resolved, explain it before changing the affected design; do not silently restore an older version.

## Apply the existing visual language

- Use actual Phosphor Light assets for interface icons, including the shared ArrowRight button/control treatment. Preserve supplied brand artwork and illustrations as exceptions; do not redraw interface icons or substitute another library.
- Reuse typography roles, spacing tokens, buttons, carousel controls, surfaces, corners, grids and responsive behavior from relevant accepted components. Inspect markup and computed appearance before introducing a new pattern or overriding shared styling. Explain necessary exceptions.
- Preserve restrained monochrome treatments. Do not introduce unapproved card/diagram elevation. Background-extension shadows and existing popup treatments are distinct cases, not reasons to ban every shadow declaration.

## Compose and critique deliberately

- Before a substantive layout change, identify the visitor's question, section takeaway and relationship to neighboring sections. Choose hierarchy, grouping, proportions, whitespace and mobile reading order to serve that purpose. Consider a meaningful alternative when a new composition is needed, then make a reasoned choice within the authorized scope.
- Reuse patterns without defaulting every section to identical cards, nested boxes or tabs. Use diagrams and motion only when they clarify relationships or change; essential meaning must remain available in static and reduced-motion states.
- Review rendered sections and their neighbors for scan order, density, balance, line breaks, alignment and visual continuity. Identify and correct material weaknesses before presenting. Technical success or a screenshot alone is not visual critique.
- For UI changes, perform scope-appropriate desktop, tablet and mobile QA, including narrow-screen overflow, shared-component regressions, keyboard/focus behavior and applicable motion cycles, pause/stop and reduced-motion states. Report only checks actually performed and any remaining limitations.
- Mid fidelity still requires deliberate composition and polished spacing. Final color, imagery and brand finish belong to a separately authorized high-fidelity phase.

## Scope and evidence

- Preserve explicit task boundaries, approved copy and restrictions on editing, packaging and publication. A request for review or instructions does not authorize redesign or deployment; workflow defaults do not override the user's limits.
- Distinguish prototype wording, illustrative scenarios and proposed claims from verified client outcomes, metrics, testimonials and service commitments. Do not convert design acceptance into factual approval.
- The November 13 workflow audits are recommendations, not implementation authorization. Do not add compliance scripts, policy files, dependencies or reusable skills unless requested. This entry point does not imply those checks already exist.

## Current approved foundations

- Preserve the latest GitHub design, including 16px Archivo body text on desktop and mobile, 14px supporting copy, and the responsive heading roles in `typography.css`.
- Primary and secondary buttons use 14px Archivo Medium, 48px height and 13px vertical / 24px horizontal padding. Label/icon pairs use a centered 16px gap. Desktop header Contact intentionally retains its compact 13px navigation treatment.
- `menu-preview.css` and `menu-preview.js` are active shared navigation assets, despite their names. The compact menu applies through 1024px, with a 72px header and no vertical header padding. Older 94px mobile-header specimen measurements are superseded.
- Keep the independent desktop timeline columns, mobile milestone disclosure and single-page seven-role listing with accessible filters. Do not restore older pagination or menu experiments.
- Update the design library and relevant specimens when an approved change modifies a documented rule. Do not propagate a section-specific experiment without agreement.

## Local work and publication

- Use this repository for both source and releases. `main` is the approved version. Pushing to `main` publishes at https://akornion.github.io/yopeso-prototype/ through GitHub Pages.
- Preview with `PORT=4710 node server.mjs` from this repository root, or another available local port. Use local work or a branch for trials; never push an unapproved trial to `main`.
- Before publishing, inspect the diff, preserve unrelated work, and perform scope-appropriate validation. After publishing, wait for the Pages build and verify the public review URL. Report local checks separately from live verification.
- Preserve `.nojekyll`, relative links and both imported histories. The former `akornion/yopeso-website` repository is archival only; do not synchronize releases to it or publish through ChatGPT Sites.
