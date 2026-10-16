# WORKFLOW.md: AI Workflow Comparison

## Approaches Compared

**Round 1** (`fe-01-vague`): one vague prompt: "Create a user settings form for my Next.js app."

**Round 2** (`fe-01-precise`): a precise prompt requiring project inspection, a plan, validation, accessibility, automated tests, and verification.

## Implementation Quality and Correctness

I forgot to commit Round 1 before switching branches, so it merged into the first Round 2 commit (`cdf2e7c`). I later restored it on `fe-01-vague` (`d4c2b7c`, `542a892`) from automatic checkpoints (`840f7de`, `f8fa7fa`), so it may not match the original exactly. Round 1's form has display name, username, email, bio, and a toggle, with validation but no tests. `fe-01-precise` has Full Name and Email fields and a Node test file; `npm test` passes all 31 tests.

## Branch Differences

After the restore, `git diff --stat` shows 7 files changed (575 insertions, 328 deletions). The page, header, layout, CSS, and `theme-script.tsx` files now match across branches, so Round 2 did not change them. Only Round 2 has the test file (367 lines) and a 3-line `package.json` change. `settings-form.tsx` (413 changed lines), `settings.ts` (97), and `settings/page.tsx` (2) also differ. Two documentation files were added later.

## Issues Found in Review

Whitespace trimming was wrong in Round 1's code and fixed in Round 2 (`3bab0c6`). Round 1 trims only inside `settings.ts`; its form component has no `.trim()` calls. The pre-fix Round 2 form likewise passed raw values to `validateSettings` and `saveSettings` and never updated the input state. The fix added a shared `trimSettings` helper, trimming on blur, and trimming before validation and saving.

**Full Name vs. Email:** In Round 2, both are trimmed identically. Afterward, Email must also match an email pattern, has its own test suite, and rejects internal spaces. Full Name only gets the required check.

**AI-generated mistake caught:** the AI-written form passed untrimmed values and left input state unchanged. Helper-level trimming tests already existed, but none render the form, so passing tests did not prove the form worked.

## Review, Testing, Accessibility, Edge Cases

Review took about 30 minutes. Tests cover whitespace, invalid email, empty storage, and corrupt JSON cases. Round 2 has no component-level tests. Accessibility: both rounds have labels, `aria-invalid`, `aria-describedby` error links, and `role="status"`. Round 2 adds `role="alert"` on errors and `aria-live="polite"`; Round 1 has neither.

## What I Learned

The vague prompt already produced labels and ARIA attributes; the precise prompt added tests, shared trimming logic, and announced errors. It did not replace review: the trimming defect surfaced only during review, and helper-level tests passed without exercising the form.

## Workflow for Future Projects

I will use the Round 2 approach: inspect the codebase, agree a plan before coding, implement in small commits, add unit and component-level tests (including whitespace edge cases), check accessibility manually, and run tests before accepting results. I will commit after each round so each can be compared cleanly, and I added project-specific rules to `CLAUDE.md`, such as always calling `trimSettings` in the form before validating.