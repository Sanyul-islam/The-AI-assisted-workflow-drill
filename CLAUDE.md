# CLAUDE.md

Rules for AI coding work in this repository.

## 1. Inspect before editing
- Review the project structure, existing conventions (naming, file layout, styling, test setup), and related files before changing anything.
- Match the patterns already in use. Do not introduce new libraries or styles without a clear reason.
- Only modify files needed for the task. Leave unrelated files untouched.

## 2. Trim form input
- Trim appropriate string values (names, emails, titles, search text) before validation and before submission. Do not trim values where whitespace is meaningful, such as passwords.
- Treat whitespace-only input as empty when checking required fields.
- Add tests for both cases:
  - whitespace-only input is rejected.
  - leading/trailing whitespace is removed from the submitted value.

## 3. Form changes
- Every input has an accessible label (`<label>` tied via `htmlFor`/`id`, or `aria-label` when no visible label fits).
- Show clear error messages, associated with their fields (`aria-describedby`, `aria-invalid`), and announce them to assistive tech (e.g. `role="alert"`).
- Test both valid and invalid submissions.
- Run the relevant tests before claiming success. Report what was run and the result; if tests could not be run, say so.