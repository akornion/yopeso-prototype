# Yopeso website prototype

This is the single active repository for the Yopeso grayscale mid-fidelity website prototype.

- Review site: https://akornion.github.io/yopeso-prototype/
- Working and release branch: `main`
- Design and collaboration instructions: [AGENTS.md](AGENTS.md)
- Approved components and measurements: [Design library](https://akornion.github.io/yopeso-prototype/design-library.html)

## Preview and review

Run `PORT=4710 node server.mjs` from the repository root, then open http://localhost:4710/.
Use local edits or a branch for experiments. Commit and push approved work to `main` to publish through GitHub Pages. Check the build and verify the published page. Keep relative links and `.nojekyll` intact.

## Consolidation, 27 November 2026

Previously, `akornion/yopeso-website` held working source and this repository held a separate review release. Their shared website files matched. Both histories were merged here without changing the approved website design; the local preview server was retained. The former working repository is retained as an archive, not a second publishing destination.

The ChatGPT Sites prototype and earlier local checkout remain historical references. New GitHub design decisions take precedence over those older copies. Onlook sessions must use this repository for future work; existing sessions connected to `yopeso-website` need to switch before further edits.
