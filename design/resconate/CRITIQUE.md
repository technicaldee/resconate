# Independent design critique

This is one critic over successive rounds. The requested native-iOS rubric is adapted to responsive web: navigation, form controls and accessible contrast are judged as web controls. No iOS-system fluency or live animation is inferred from screenshots. Round 1 inspected all 14 requested after screenshots and both before screenshots. Screenshots establish visible design only; unseen routes are not assumed complete.

## Round 1

Quick tests: covering the logo still leaves the shop drawing and worker-pay language, although workers/settings have a more ordinary administrative skeleton. The landing-page squint test favours the headline; the empty workspace incorrectly favours recording over onboarding. The restrained outlined illustration is distinct from the old gradients and generic fintech dashboard. Spacing and colours are coherent in light mode. A possible feature headline is “A working counter for a small team's pay.” Removing the repeated workspace illustration would improve data density once an owner has workers; removing it from first-run onboarding would weaken the welcome.

| # | Rubric | Score | Visible evidence |
|---|---|---:|---|
| 1 | Concept on the pixel | 4 | The shop-counter drawing, worker agreements and receipt-like review sheet connect the landing, overview and record flow; list-only settings has less concept presence. |
| 2 | Not the category average | 4 | Paper/navy, a local shop drawing and direct worker-pay actions avoid the usual fintech metric-card grid and the old luminous gradient hero. |
| 3 | Not this skill's average | 4 | Hanken Grotesk, blue illustration surfaces and rounded awning geometry give the ruled records a specific voice rather than monochrome ledger minimalism. |
| 4 | Hierarchy | 3 | Home has a clear headline, but the empty overview gives “Add a record” precedence before any worker exists and demo overview has two prominent action groups. |
| 5 | Typography | 4 | The bold display/body contrast is clear and currency aligns consistently; uppercase metadata remains subordinate to headings. |
| 6 | Colour | 2 | Light mode is memorable and restrained, but 05-dark shows pale text and white logo marks on an unchanged paper ground, with nearly invisible bottom navigation. |
| 7 | Richness | 4 | Original shop, worker, receipt and chat drawings share navy outlines and blue surfaces; the desktop hero has a convincing illustrative pay slip. |
| 8 | Rhythm and space | 3 | The desktop layouts align well, but the mobile landing consumes most of the initial viewport before the illustration, and the demo overview uses large explanatory sections before useful records. |
| 9 | Craft details | 3 | Light-mode rows and icon weights are consistent, but “1 PEOPLE,” “1 workers,” raw lower-case plan/status labels and the broken dark logo expose unfinished edges. |
| 10 | Native fluency → responsive-web/control fluency | 3 | Mobile bottom navigation and the review sheet are clear web patterns, but inaccessible dark controls and the misplaced first-run action prevent a ship-level score. |
| 11 | Signature | 4 | Review and saved states make the amount and named worker explicit; the receipt transition is shown, though its saved wording loses the record's type. |
| 12 | Feature test | 3 | The desktop marketing frame is screenshot-worthy; the broken dark frame and ordinary list/settings framing keep the overall set below feature quality. |
| 13 | Fidelity (redesign) | 3 | Logo, workers, pay, banking intent, plan access and service/help links are visibly retained; recruiting/leave/reviews and complete services/subscription routes are outside this screenshot set and therefore unverified here. |

### Five executable changes

1. **Repair the dark theme everywhere.** On 05-dark, apply the dark navy ground to `html`, `body`, the workspace header and content surfaces; use paper ink for headings/navigation and contrasting selected-tab treatment. Keep the illustration itself on its designed light-blue plate. Re-render this same frame and a dark worker/settings frame, checking the logo, metadata, buttons and bottom labels.
2. **Make first-run onboarding a single clear action.** In 07-empty, replace the top “Add a record” with “Add your first worker.” Hide the redundant “View team” action while the team is empty. The contextual first-worker message should lead directly to the worker form.
3. **Tighten the mobile overview and landing hierarchy.** At 375–390px, reduce the gap between hero copy and illustration and reduce top/section padding by one token (e.g. 32px to 24px). On 02-demo keep one primary action (“Add a record”), make “Prepare pay” a quieter link or compact secondary control, and reduce the oversized explainer enough that latest records are reached sooner. Preserve the illustrated welcome for an empty workspace.
4. **Finish the small-team copy.** Correct “1 PEOPLE IN YOUR TEAM” to “1 PERSON IN YOUR TEAM” and “1 workers” to “1 worker”; display “Growth” and “Draft/Paid” with intentional casing. Replace the sample avatar's `A—` with believable owner initials. Re-render single-worker and demo states to verify these exact strings.
5. **Make the saved receipt describe the action.** In 04-record-saved, use “Advance recorded” for this record and include the date beneath the amount/name. Payments should explicitly say “Cash payment recorded” or “Bank payment recorded” as applicable; recording a payment must not imply provider confirmation. Keep the existing short return action and avoid adding decoration.

Status: 6 of 12 primary lines are at least 4; colour is below 3. **Not done by the stop rule in critique.md.**

## Round 2

All 18 requested Round 2 renders inspected. The worker and empty-state changes have landed; the dark wrapper repair is only partial. The additional tools/services screens establish previously unseen kept features. The file named `14-plan-connections.png` shows the top of settings and the plan heading, rather than the actual connection controls.

| # | Rubric | Score | Visible evidence |
|---|---|---:|---|
| 1 | Concept on the pixel | 4 | The same shop-counter plate anchors onboarding and overview, with the record receipt carrying the concept into a practical task. |
| 2 | Not the category average | 4 | Small-team pay language, a restrained navy/paper palette and local-shop artwork remain distinct from generic payroll dashboards. |
| 3 | Not this skill's average | 4 | The illustration, open grotesk face and rounded blue plates preserve an identifiable art direction around otherwise necessary rows and fields. |
| 4 | Hierarchy | 4 | Empty state now gives first-worker setup the primary control; populated overview gives recording priority and quiets prepare-pay to an outline action. |
| 5 | Typography | 4 | Headline/body scale remains clear; singular-worker labels and readable plan labels remove rough copy edges. |
| 6 | Colour | 2 | Navy page ground now lands, but dark headings, wordmark and navigation still render in navy on navy in 05-dark and 15-dark-settings. |
| 7 | Richness | 4 | The outlined artwork is coherent across hero and compact workspace plate, with no unnecessary chart/card decoration. |
| 8 | Rhythm and space | 4 | The compact overview makes the latest-records section begin within the mobile frame; desktop columns and list verticals remain aligned. |
| 9 | Craft details | 3 | Singular Person/worker, proper plan naming and AO initials are fixed, but dark headings/labels still disappear and the sample-banner arrow wraps alone. |
| 10 | Native fluency → responsive-web/control fluency | 3 | The first-run flow and mobile navigation structure improve, but dark navigation labels and form labels are inaccessible visually. |
| 11 | Signature | 4 | “Advance recorded,” named worker, amount and date now make the saved screen a meaningful receipt instead of a generic success message. |
| 12 | Feature test | 3 | Light-mode marketing and receipts are polished; the dark-theme defect still disqualifies the complete set from feature quality. |
| 13 | Fidelity (redesign) | 4 | The new team-tools view visibly retains Leave/Vacancies/Reviews, and services retains workforce setup plus separate web/design requests; plan and bank/connection implementation need functional checks beyond these static views. |

### Did the five Round 1 asks land?

1. Dark theme: **partly**. Actual surfaces now turn navy and illustration stays on blue, but explicit navy ink remains on headings, logo wordmark, avatar and navigation.
2. First-run action: **yes**. “Add your first worker” leads, with no redundant View team control in the empty welcome.
3. Mobile density: **yes**. Overview is shorter, prepares pay as an outline action and reaches latest records sooner. Landing remains comfortably large rather than crowded.
4. Small-team copy: **yes**. The single-worker desktop frame says “1 PERSON,” payroll says “1 worker,” plan names are readable and sample avatar says AO.
5. Saved receipt: **yes** for the advance state shown. It includes the action and date. Payment-specific language is reported by implementation but not present in this render set.

### Five remaining concrete checks/changes

1. In dark mode override explicit heading/strong/label ink to paper (`#fffcf6` or equivalent): this includes the main title, secondary title, Business details/Plan titles and field labels.
2. Override dark-mode links, logo wordmark and avatar text to paper; “View team,” “Compare plans,” the wordmark and initials currently disappear.
3. Give all dark bottom-navigation icons and labels paper ink, and the active tab a contrasting muted blue treatment. Verify each label is plainly readable in a fresh dark screenshot.
4. Keep the sample banner's create-workspace arrow with its text at 375–390px (inline-flex grouping or a nonbreaking final text group), rather than a lone arrow on a new line.
5. Capture the actual scrolled plan/connection section and the saved payment receipt for the final evidence set. The current `14-plan-connections` frame cannot establish those visible controls or the distinction between recorded cash and provider-confirmed transfers.

Status: 8 of 12 primary lines are at least 4; colour remains below 3. **Not done by the stop rule in critique.md.** A targeted Round 3 dark repair is required; no structural redesign is requested.

## Round 3

All 19 requested PNGs inspected. The navy theme now has readable paper headings, wordmark, field labels, links and initials. One concrete residual defect remains: selected mobile-navigation icon/text still uses navy ink on muted blue, while its unselected siblings use readable paper. This is visible on Today in 05-dark and Settings in 15-dark-settings.

| # | Rubric | Score | Visible evidence |
|---|---|---:|---|
| 1 | Concept on the pixel | 4 | Shop plates and explicit worker-pay receipts continue to give the flow a recognisable working-counter identity. |
| 2 | Not the category average | 4 | The light paper/navy composition and small-business language still avoid the usual dense payroll metric dashboard. |
| 3 | Not this skill's average | 4 | Blue illustrative plates, open grotesk typography and direct controls remain more specific than a generic ruled ledger. |
| 4 | Hierarchy | 4 | First-worker setup and recording lead in their respective states, while pay preparation is clearly secondary. |
| 5 | Typography | 4 | Distinct display/body scales, aligned currency and intentional singular-worker wording remain consistent. |
| 6 | Colour | 3 | Almost all dark text now contrasts correctly, but the selected navigation ink is still too dark on its blue plate. |
| 7 | Richness | 4 | The shop illustration and slip motif give the sparse interface a coherent visual subject without decorative clutter. |
| 8 | Rhythm and space | 4 | Compact mobile overview reaches records sooner; wide desktop columns and worker-list verticals remain orderly. |
| 9 | Craft details | 3 | The sample-banner arrow is fixed and receipts now include date/type; selected dark navigation is the remaining visible unfinished edge. |
| 10 | Native fluency → responsive-web/control fluency | 3 | Forms, sheet actions and unselected tabs are readable, but the active navigation state still needs contrast repair. |
| 11 | Signature | 4 | The cash receipt names method, amount, person and date, and explicitly states that it records a report rather than sending money. |
| 12 | Feature test | 3 | The marketing and receipt frames are feature candidates; a visible active-navigation contrast defect prevents a complete-set score of 4. |
| 13 | Fidelity (redesign) | 4 | Scrolled settings now shows all priced plan controls and honest WhatsApp/bank/email connection states; tools and scoped services remain present. |

Prior asks: dark inherited ink **landed**; wordmark/link/avatar ink **landed**; selected-tab ink **partly landed** (unselected fixed, selected still navy); sample-banner arrow **landed**; actual connection and cash-receipt evidence **landed**.

### Final targeted actions/checks

1. Set dark selected mobile-navigation icon/text explicitly to paper, overriding the higher-specificity selected-tab rule.
2. Check this state on both Today and Settings so the correction is tied to the selected state rather than one route.
3. Assert the computed selected-tab text colour in the browser test; a generic page-theme assertion did not catch the cascade collision.
4. Re-render the two affected dark frames at 390px and one at 375px; no additional structural polish is requested.
5. Preserve the now-correct receipt wording and honest connection states in final gallery/export captures.

Status: 8 of 12 primary lines are at least 4, with no score below 3. **Not done by the stop rule in critique.md.** Only the active dark tab prevents completion; a focused final verification round is sufficient.

## Round 4 — final targeted verification

Inspected production renders `05-dark`, `15-dark-settings`, `dark-small` (375px), `16-cash-receipt` and `14-plan-connections`. Other unchanged design judgments carry forward from Round 3. The selected Today and Settings icons/text now use paper ink against blue; the remaining concrete contrast defect is resolved. The smaller view preserves readable controls and the sample CTA stays together. This is the fourth and final skill round.

| # | Rubric | Score | Visible evidence |
|---|---|---:|---|
| 1 | Concept on the pixel | 4 | Shop-counter imagery, team agreements and the explicit receipt flow retain the same recognisable concept. |
| 2 | Not the category average | 4 | The restrained paper/navy world and owner-language controls remain distinct from fintech metric grids. |
| 3 | Not this skill's average | 4 | Original outlined artwork and practical grotesk typography give required ledger rows their own character. |
| 4 | Hierarchy | 4 | First-run setup and everyday recording have the right primary action; pay preparation remains secondary. |
| 5 | Typography | 4 | Display/body contrast, currency alignment and corrected small-team wording are consistent across the retained frames. |
| 6 | Colour | 4 | Dark navy now supports readable paper headings, wordmark, labels and selected/unselected tabs, while art remains on a deliberate blue plate. |
| 7 | Richness | 4 | Shop illustration and receipt motifs add a coherent visual subject without extraneous metrics or decorative gradients. |
| 8 | Rhythm and space | 4 | Compact overview and aligned desktop columns retain generous but purposeful spacing; 375px controls remain legible. |
| 9 | Craft details | 4 | Selected dark navigation now matches the intended ink, banner arrow stays grouped and receipts name amount, worker, type and date. |
| 10 | Native fluency → responsive-web/control fluency | 4 | The mobile navigation, form labels and sheet actions have readable, coherent active states in both themes. |
| 11 | Signature | 4 | The dated cash receipt clearly communicates a recorded action, with explicit distinction from sending money. |
| 12 | Feature test | 3 | The marketing/receipt art direction is strong, but the functional list/settings screens remain competent rather than portfolio-level distinctiveness. |
| 13 | Fidelity (redesign) | 4 | Workforce/pay, optional tools, scoped services, priced plans and honest integration states are visibly retained; live-provider correctness remains outside design review. |

All remaining Round 3 asks landed: selected ink, both selected routes, small-width rerender and retained connection/receipt evidence. The owner reports the computed-colour assertion passing in production; this critic independently confirms the visible result rather than claiming to have run that test.

No further changes are requested. Five previously named concrete areas verified: (1) selected Today ink; (2) selected Settings ink; (3) 375px navigation and CTA grouping; (4) explicit cash-payment receipt; (5) honest connection statuses and plan controls. There are no newly identified concrete defects in these targeted frames.

Status: 11 of 12 primary lines are at least 4, with no line below 3. **Done by the stop rule in critique.md.** Design completion does not certify live integrations, production operations or legal content.

### Post-review mechanical verification

After round 4, the mobile workspace parent's overflow changed to visible so the fixed navigation's bounds are not incorrectly treated as clipped by the DOM scanner. Pixel comparisons before/after were identical for light demo, dark demo and dark settings at 375px. This does not change the scored pixels. Snapshot exports now preserve viewport height and scroll offset. Warning responses and the complete verification scope are in `docs/VERIFICATION.md`.

After design review, business dates were made explicit for Africa/Lagos and date-only display was protected from browser timezone shifts. This functional correction is outside the design scoring; it does not change the reviewed screenshots at the recorded date. Backend boundary tests and production browser acceptance cover the final implementation.
