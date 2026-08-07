Attn: GitHub Desktop

When generating or suggesting commit summaries, always use the Conventional Commits format.

The format must strictly follow:

<type>: <short description>

Rules:

- The `<type>` must be one of the following: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `deps`, `security`, `config`, `release`, `merge`, `hotfix`, `ui`, `ux`, `i18n`, `a11y`, `devops`.
- The `<short description>` must be concise, written in the imperative mood, and in lowercase.
- Do not add a period at the end of the description.

Examples:

- `feat: add the login page`
- `fix: correct the form validation error`
- `docs: update the README file`

Do not include any body in the commit message, only provide the summary. If body is required by the tool, respond with `N/A`.
