# CLAUDE.md

Rules for AI coding work in this repository (Next.js App Router, TypeScript, Tailwind).

## General
1. Inspect the project structure and existing conventions before editing. Follow the patterns already in `src/components/` and `src/lib/`, and do not modify unrelated files.
2. Match the existing Tailwind style (zinc palette with `dark:` variants) instead of introducing new styling approaches.

## Form input
3. Trim string fields (currently `fullName` and `email`) with the shared `trimSettings` helper in `src/lib/settings.ts`. Call it in `handleSubmit` before `validateSettings` and `saveSettings`, and trim on blur so the input shows the trimmed value. Never rely on trimming only inside lib functions. Do not trim values where whitespace is meaningful, such as passwords.
4. Treat whitespace-only values as empty, so they produce the required-field errors (`Full name is required.`, `Email is required.`).
5. For every new string field, add whitespace-only and leading/trailing whitespace tests to `src/lib/settings.test.mjs`.

## Accessibility
6. Follow the pattern in `settings-form.tsx`: a `<label htmlFor>` for every input, `aria-invalid`, `aria-describedby` pointing to the error element id (for example `email-error`), error text with `role="alert"`, and the success message with `role="status"` and `aria-live="polite"`.

## Testing and verification
7. Run `npm test` (`node:test` on `src/lib/settings.test.mjs`) before claiming success, and report the actual result.
8. `npm test` covers only `src/lib`, not the form component. After changing `settings-form.tsx`, also check `/settings` in the browser: valid submission, whitespace-only input, and invalid email.
9. Test both valid and invalid submissions for every form change.

## Git
10. Commit after each task or round, before switching branches. Uncommitted changes carry over silently.
11. Write commit messages that match what the commit actually contains.
12. Treat `fe-01-vague` and `fe-01-precise` as comparison snapshots: do not merge them into each other.