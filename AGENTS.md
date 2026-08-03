# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

Odyssey's right rail should feel game-forward and expressive while keeping Wikipedia credible. Use shadcn-inspired local primitives with the existing plain-CSS architecture, reserve richer motion for progress, feedback, identity milestones, and completion, and use Radix only for behavior-heavy primitives such as the topic popover.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Durable UI notes:
- Use `wikiplay-blue.png` for favicon and in-panel blue-brand marks, `wikiplay-white.png` for the launcher button icon on blue surfaces, and `WikiPlay.png` for website thumbnail/social metadata.
- Keep the intro screen's top padding aligned with the rest of the rail screens, and anchor the `Start Playing` CTA to the bottom of the intro layout.
