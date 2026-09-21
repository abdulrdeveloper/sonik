# Contributing to Sonik

Thank you for helping improve Sonik. Contributions should be focused, testable, and consistent with the existing frontend and backend structure.

## Before you start

1. Read the [Code of Conduct](./CODE_OF_CONDUCT.md).
2. Read the [Security Policy](./SECURITY.md).
3. Search existing issues and pull requests before opening a new one.
4. For larger changes, open an issue first to discuss the proposed direction.

## Development setup

```bash
git clone <repository-url>
cd sonik-app

cd Backend
pnpm install
cp .env.example .env

cd ../Frontend
pnpm install
cp .env.example .env
```

Never commit either `.env` file or real credentials.

## Project conventions

- Keep frontend pages in `Frontend/src/pages/`.
- Keep feature-specific landing code under `Frontend/src/pages/landing/`.
- Keep genuinely reused UI in `Frontend/src/components/`.
- Keep API configuration in `Frontend/src/config/api.js`.
- Preserve the existing React, Vite, Tailwind, and ES module conventions.
- Keep API behavior and authentication cookie handling backward-compatible unless the change explicitly requires otherwise.
- Avoid unrelated formatting or refactoring in the same pull request.

## Testing changes

Run the frontend checks:

```bash
cd Frontend
pnpm build
pnpm lint
```

Run backend syntax checks for changed JavaScript files:

```bash
node --check Backend/server.js
node --check Backend/src/app.js
```

For API changes, test successful, validation, unauthorized, and error responses. For UI changes, test the affected route on desktop and mobile viewport sizes.

## Pull requests

A pull request should include:

- A clear summary of the change.
- The user flow, API route, or component affected.
- Testing performed and its result.
- Any environment variable, migration, or deployment changes.
- Screenshots or a short recording for visual changes when useful.

Keep pull requests focused and explain known limitations or follow-up work.

## Commit messages

Use concise, imperative commit messages, for example:

```text
Add artist album listing
Fix login error handling
Update Render deployment notes
```
