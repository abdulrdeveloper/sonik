# Security Policy

## Supported versions

Sonik is currently maintained from the default branch. Security fixes should be reported against the latest available version.

## Reporting a vulnerability

Please do not open a public issue for a suspected security vulnerability.

Report security concerns privately to the project maintainer at `abdulrahman2040@gmail.com` with:

- A clear description of the vulnerability.
- The affected component, route, or file.
- Steps to reproduce the issue.
- The potential impact.
- Any proof of concept, logs, or screenshots that can be shared safely.

Please avoid including real credentials, tokens, database exports, or private user data in a report.

## What to expect

The maintainer will acknowledge a report when practical, investigate the issue, and coordinate a fix or mitigation. Please allow reasonable time for investigation before publicly disclosing the issue.

## Security practices

- Never commit `.env` files or secrets.
- Rotate credentials immediately if they are exposed.
- Use strong values for `JWT_SECRET`, database credentials, and ImageKit keys.
- Keep dependencies and deployment services updated.
- Use HTTPS and secure cookies in production.
- Restrict backend CORS with the production frontend origin.
