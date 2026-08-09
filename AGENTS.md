# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

Odyssey's right rail should feel game-forward and expressive while keeping Wikipedia credible. Use shadcn-inspired local primitives with the existing plain-CSS architecture, reserve richer motion for progress, feedback, identity milestones, and completion, and use Radix only for behavior-heavy primitives such as the topic popover.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Durable UI notes:
- Use `wikiplay-blue.png` for favicon and in-panel blue-brand marks, `wikiplay-white.png` for the launcher button icon on blue surfaces, and `WikiPlay.png` for website thumbnail/social metadata.
- Keep the intro screen's top padding aligned with the rest of the rail screens, and anchor the `Start Playing` CTA to the bottom of the intro layout.
- Place source-reliability help beneath the citation URL field at 16px; keep its dialog lightweight and avoid nested card surfaces.
- Topic choices must provide an immediate selected state and navigate the article to the chosen module without delayed task scrolling overriding that action.
- The phone explainer is video-first: show the WikiPlay icon and name in a sticky white header, present the complete `2880x1720` video edge-to-edge at its native aspect ratio on a dark `contain` frame, then place three stacked icon, title, and description benefit rows in a white lower sheet. End the sheet with a locked `Web-Only Experience` control and the design credit. Keep the video muted, autoplaying, looping, and free of user controls.
- Keep the final action and the `ruchit.me` credit grouped and anchored to the bottom of both the desktop/tablet WikiPlay intro and the mobile explainer sheet so available whitespace separates them from explanatory content.
- Keep the small `ruchit.me` design credit visible on both the desktop intro and phone explainer without competing with primary content.
- Keep all task inputs, textareas, URL fields, and placeholders at `16px`; drag-selected article text and manual typing must remain equivalent input methods where selection is enabled.
- Keep article highlighting exclusive to explicit Learn More states. Routine task changes may scroll to a section but must not highlight it.
- Fact-check `Yes` and format-valid sourced `No` are both successful contribution branches. Only sourced verification promotes the user to Fact-Checker, while correct answers add points once and wrong or skipped rounds never change the score.
- Rounds 6-8 must stay bound to one selected topic and follow Learn, Verify, then Contribute.
- Below `768px`, show the accessible video explainer instead of the article-and-rail workflow. From `768px` upward, preserve the split article and rail experience without horizontal overflow.
