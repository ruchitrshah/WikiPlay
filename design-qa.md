# Design QA

## Review Scope

- User references: `Screenshot 2026-08-02 at 3.59.57 PM.png`, `Screenshot 2026-08-02 at 4.01.14 PM.png`, and `Screenshot 2026-08-02 at 4.05.01 PM.png`.
- Corrected invitation: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-accessibility-invitation-1440.png`.
- Corrected question rail: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-accessibility-question-1440.png`.
- Corrected source form: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-accessibility-source-form-1440.png`.
- Clean Wikipedia shell: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-clean-shell-1440.png`.
- Clean Wikipedia shell with WikiPlay open: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-clean-shell-open-1440.png`.
- Compact glass WikiPlay rail: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-glass-rail-1440.png`.
- Be Vietnam Pro and Phosphor controls: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-be-vietnam-phosphor-1440.png`.
- American Grotesk and unified controls: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-american-grotesk-controls-1440.png`.
- Maison Neue, balanced gutters, and unified choice rows: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-maison-neue-chips-1440.png`.
- Unified purple actions and selected states: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-unified-purple-selected-1440.png`.
- Neutral WikiPlay invitation: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-neutral-invitation-1440.png`.
- Friendly neutral feedback rail: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-neutral-feedback-1440.png`.
- Compact invitation with animated benefit icons: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-invitation-compact-1440.png`.
- Lottie success state with rolling score and plain selected check: `/Users/ruchitshah/Downloads/Wikipedia Prototype/qa-success-delight-1440.png`.
- Browser viewport: 1440 x 900 at device pixel ratio 1.

## Before And After

| Before | After | Why |
| --- | --- | --- |
| Purple invitation with low-separation white CTA | White invitation with dark copy and a solid `#1A1A1A` CTA | Improves contrast, hierarchy, and action visibility |
| No invitation dismissal | 36px circular dismiss control plus persistent header launcher | Gives users control and a clear recovery path |
| No right-rail exit | 44px labeled close control in the WikiPlay header | Makes the panel reversible without resetting progress |
| 11-14px rail copy | 16px body, choices, fields, and buttons; 26px questions | Aligns readability with the Wikipedia article |
| Mixed 48px, 50px, and 52px controls | 52px buttons and single-line form controls | Creates consistent rhythm and target sizing |
| Placeholder-led source fields | 15px semibold visible labels with 16px field text | Keeps fields understandable after values are entered |
| Uneven 14-30px rail gutters | 32px content gutter and consistent 20-32px vertical groups | Strengthens scanning and hierarchy |
| “Paul's Odyssey” | “WikiPlay” | Establishes one consistent product identity |
| Topic recommendations shown during active questions | Topic recommendations shown only after a submitted answer | Keeps the active task focused and introduces agency at the feedback decision point |
| Side-by-side Submit and Skip actions | Full-width Submit followed by full-width Skip | Establishes a clear primary action and improves scanning in the narrow rail |
| Simulated macOS browser chrome inside the page | One authentic 76px Wikipedia header inside the real browser | Removes the double-browser effect that made the prototype look artificial |
| Circular placeholder globe and uppercase wordmark | Restrained serif Wikipedia wordmark and tagline | Better matches the current Wikipedia header hierarchy |
| Fixed full desktop header when WikiPlay opens | Search and account links collapse while core utilities remain | Keeps the constrained article header credible and prevents crowding |
| 124px WikiPlay brand and progress header | 76px progress strip with an embedded close control | Removes repeated branding and returns 48px to the task |
| Generic system typography in the rail | Self-hosted Be Vietnam Pro with navy text, slate support copy, and restrained 600-weight headings | Matches the requested typeface and supplied form reference hierarchy |
| Opaque white rail surfaces | Translucent panel, top strip, footer, fields, and choices with restrained backdrop blur | Adds subtle glass depth without reducing control contrast |
| Loose Georgia-style article title | Libre Caslon Condensed at 42px/42px with -1.15px tracking | Produces the tighter Wikipedia title requested |
| Be Vietnam Pro rail typography | Test American Grotesk regular, medium, and bold | Uses the supplied collection and gives questions stronger weight without changing article body copy |
| Mixed 40px, 44px, and 46px controls | One 44px control-height token | Keeps text fields, citation fields, choices, multiple-choice rows, popover options, and buttons aligned |
| Active History and footer Explorer pills | No persistent topic or identity pills | Reduces decorative UI and keeps attention on the task and score |
| Borderless close icon | 44px close control with a neutral border and visible focus ring | Improves target recognition and keyboard accessibility |
| American Grotesk rail typography | Self-hosted Maison Neue Medium, Demi, and Bold cuts | Uses the requested family while preserving predictable semantic weights |
| Bold 700 question prompts | Maison Neue Demi at 600 with a 1.28 line-height | Keeps questions prominent without making multi-line prompts visually dense |
| Light option labels and undersized selection icons | Maison Neue Medium labels with 20px Phosphor circle states | Improves legibility and visual balance within the compact control scale |
| Uneven rail gutters caused by a reserved scrollbar gutter | Equal 28px left and right content insets with no horizontal overflow | Keeps text, choices, and actions aligned to one vertical grid |
| Pill-shaped topic chips with mismatched spacing | 44px chips with 4px radii, 14px horizontal padding, and 18px icons | Matches the dimensions and visual language of rail buttons |
| Purple and black interaction states | `#1A1A1A` primary actions, progress, focus, and selected states on white or soft gray surfaces | Gives WikiPlay one coherent neutral brand system |
| 1px selected borders and a square 44px close control | 2px selected borders plus a circular 36px close control with a 16px glyph | Strengthens selection while reducing the close control's visual weight |
| Border width changed only after selection | Constant 2px border geometry with a 1px inset neutral stroke when unselected | Prevents one-pixel label and icon movement during the selected-state transition |
| Icon artwork placed inside tinted tiles | Large standalone coral, blue, amber, and teal Phosphor icons | Adds warmth and identity without introducing more boxes |
| Mechanical success/error titles | “Nice Work!”, identity-specific promotions, and “Almost There. Keep Going!” | Makes feedback encouraging while preserving clear state meaning |
| Boxed amber reader-impact message | Prominent unboxed reader-impact headline and supporting copy | Elevates purpose without low-energy warning colors |
| Mixed sentence-case action labels | Title Case labels including `Learn More`, `Next Question`, `New Topic`, and `Play Again` | Keeps visible action naming consistent |
| Filled circular checks in selected controls | Plain 20px Phosphor checks with native radio and checkbox semantics retained | Removes the icon-within-icon effect without sacrificing accessibility |
| Static `0 → 1` score swap | Two-row iOS-style odometer in both the success badge and footer | Makes the reward legible as a change instead of a replaced number |
| Success badge showed only the latest task reward | Success badge and footer both show the cumulative score; the badge animates from the previous total to the new total | Keeps reward feedback and persistent progress synchronized |
| Skip advanced immediately | Skip decision offers `Learn More` or `Continue Playing` before advancing | Turns uncertainty into an optional learning moment without penalizing the player |
| Later verification could repeat or replace an identity milestone | Identity promotions are monotonic and appear only when newly earned | Preserves the meaning of Explorer, Fact-Checker, and Contributor progression |
| Small icon-centered glow that did not match the earlier exploration | Full-rail coral-left, teal-right atmospheric field with an enlarged locally bundled six-particle Lottie layer | Restores the original soft success atmosphere while keeping the content surfaces readable |
| Large invitation headline separated from dismissal | Compact 20px/1.32 heading aligned beside the circular close control | Improves hierarchy and reduces unused vertical space |
| Check icons repeated inside selected topic chips | White selected topics communicated by a crisp 2px `#1A1A1A` border only | Removes redundant decoration while preserving a clear `aria-pressed` state |
| One dense completion impact sentence | Demi-weight `~5,800 readers daily` lead plus a lighter lasting-impact explanation | Creates a more readable impact hierarchy without adding another box |
| Completion values appeared immediately | Delayed, staggered 0-to-final count-up with one-time card border sweeps | Gives the rare completion moment a legible reward sequence |
| Resolution actions could theoretically run twice before a phase repaint | Score, skip, and advance reducers accept only the valid current phase and unresolved step | Guarantees each correct reward is added once while wrong answers and skips preserve the total |
| Task passages highlighted automatically | Normal tasks only scroll to their article section; highlighting is reserved for an explicit `Learn More` choice | Keeps the article readable and makes highlighting a deliberate learning aid |
| Contribution source text was pre-authored in the rail | Any dragged article text is captured on mouse release and copied verbatim into the contribution preview | Makes the micro-contribution originate from the reader's actual selection rather than a disconnected form |
| Contribution fields accepted input before a source sentence was chosen | Replacement and citation fields remain disabled until the article sentence is selected; Submit additionally requires 25 characters and a valid `http(s)` URL | Enforces the intended select, replace, cite, submit sequence |
| Article drag-selection only supported contribution tasks | Short-answer selections fill `Your Answer`, visible fact-check selections fill the correction field, and contribution selections define the source text | Makes article-to-input interaction consistent across every free-text task |
| Success feedback used a separate green palette | Checks, completed steps, trophy, title shine, stat sweep, and success Lottie particles use the same `#2563EB` family as Learn More | Unifies learning and successful contribution under one positive accent |
| WikiPlay appeared after the article started resizing | The mounted rail slides from the right over the same 260ms easing used by the grid-column transition | Makes opening feel like the reverse of closing instead of an abrupt insertion |
| Frozen article and topic bank covered six core sections | Added Climate, Arts and Culture, Parks, Sports, Government, and Education passages plus flexible quiz and contribution variants | Makes the local article feel more credible and gives the data-driven module substantially more reusable content |

## Accessibility Evidence

- Axe semantic checks pass for the invitation, question rail, and conditional source form.
- Fixed a real heading-order issue by removing the infobox's skipped `h3` level.
- Current progress uses `aria-current="step"`; fields have programmatic visible labels; errors use `role="alert"` and `aria-describedby`.
- Focus rings use a solid 3px `#1A1A1A` outline with 3px offset.
- Dismiss returns focus to `Open WikiPlay`; opening focuses `Close WikiPlay`; closing returns focus to the launcher.
- The `#1A1A1A` primary CTA and selected treatment provide high contrast against white and soft-gray surfaces; semantic error text remains independently readable.
- Reduced-motion behavior continues to remove translation, scaling, and shaking while retaining color and opacity feedback.
- The visual score reel is `aria-hidden`; a dedicated screen-reader string announces the final point total without reading both odometer rows.
- Decorative Lottie SVG is hidden from assistive technology, never loops, and resolves to a static success symbol under reduced motion.
- The Skip decision is an in-panel `dialog`, not a falsely modal overlay; focus moves to `Learn More` without trapping users away from the panel close control.

## Browser Evidence

- Rail width: 456px with no horizontal overflow.
- Rail content padding: 26px top, 28px left and right, and 36px bottom.
- Question: Maison Neue Demi at 22px/28.16px, weight 600.
- Instruction: Maison Neue Medium at 14px/20.3px, weight 400, with a 12px gap before the question.
- Choice labels: Maison Neue Demi at 14px/14px, weight 600.
- Choice rows: 44px high with 14px horizontal padding; icon and label centers align exactly to the row center.
- Selected choices and topic chips: 2px `#1A1A1A` border with 160ms color, background, and shadow transitions.
- Selected and unselected labels share the same 46px inset, so selection causes no spatial shift.
- Primary actions use `#1A1A1A`; hover uses black; white action text retains strong contrast.
- Close control: 36px circular button with a 1px neutral border and 16px Phosphor X icon.
- Buttons, single-line inputs, source fields, choices, popover rows, and topic chips measure 44px high.
- Close, relaunch, and resume preserve score, answers, and progress.
- Invitation pointer is within 7px of the `Open WikiPlay` launcher center at 1440 x 900.
- Instruction-to-question spacing is 8px on the first task.
- Submit and Skip are stacked at 377 x 52px with a 10px gap.
- `Choose your path` is absent during the active task and present after wrong-answer feedback.
- No simulated browser chrome remains in the document.
- The Wikipedia header and article begin at 76px with no horizontal overflow.
- The invitation pointer is centered within 1px of the WikiPlay launcher after the header cleanup.
- With WikiPlay open, search and account links collapse while translation, reading, and account utilities remain visible.
- WikiPlay uses 56px / flexible content / 60px grid rows at 1440 x 900.
- The close control sits inside the progress strip with a permanent neutral border and visible keyboard focus ring.
- Right-rail controls use 4px radii, 14px labels, neutral ink/slate text, and translucent white surfaces.
- Radio and checkbox tasks retain native semantic inputs while rendering Phosphor `Circle` and plain `Check` states.
- No CSS-generated checkbox shape or checkmark remains.
- Close and error icons use Phosphor regular weights; brand and reward icons use intentional fill or duotone weights.
- WikiPlay computes to Maison Neue while the Wikipedia article remains its original system sans at weight 400.
- Questions use Maison Neue Demi, option labels use Medium, and article headings remain Libre Caslon Condensed.
- Radio options, multi-select options, text inputs, citation inputs, popover rows, and buttons measure 44px high.
- Identity and recommendation-label pills are absent; visible selected topics use `aria-pressed`; button labels use Title Case.
- Correct feedback, Explore Source, and completion render the full-rail coral/teal atmosphere plus six Lottie SVG particle shapes; selected topics contain no decorative check.
- At 190ms, the score reel computes to a mid-transition vertical transform, confirming that `0 → 1` rolls rather than swaps.
- Correct feedback, Explore Source, and completion share the same softly animated coral/teal atmospheric field; ordinary question, wrong-answer, and skip-decision states retain neutral backgrounds.
- Skip → Learn More keeps the current step marked skipped until `Next Question`; Skip → Continue Playing marks it skipped and advances immediately.
- Feedback announces points earned for the current task while the footer announces the cumulative total.
- Contribution step 5 scrolls to Demographics without highlighting or converting article text into special controls.
- Drag-selecting any text within the article copies it into the rail and enables replacement and citation fields; selecting different text resets an unfinished replacement and source to prevent mismatched submissions.
- Browser console: no application errors or warnings; only Vite and React development messages.

## Verification

- `npm run typecheck`: passed.
- `npm test`: 40 tests passed across 4 files.
- `npm run build`: passed.
- `npm run test:sites`: 4 tests passed.

## Findings

- P0: none.
- P1: heading-order violation found and fixed.
- P2: none.
- P3: the frozen article remains intentionally condensed relative to live Wikipedia.

final result: passed
