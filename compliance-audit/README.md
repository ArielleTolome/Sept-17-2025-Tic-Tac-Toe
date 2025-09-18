# Compliance & Accessibility Audit Pipeline

Automated Playwright + axe-core audits against `PUBLIC_WEB_URL`. Produces an HTML report and fails CI on violation threshold.

## Quickstart

```bash
npm ci
PUBLIC_WEB_URL=http://localhost:5173 npm run build
PUBLIC_WEB_URL=http://localhost:5173 npm run audit
# See reports/a11y-report.html
```

## Env Vars

- `PUBLIC_WEB_URL` — target site
- `REPORT_DIR` — output directory (default `./reports`)
- `THRESHOLD_VIOLATIONS` — max allowed violations (default 0)

## CI

Workflow `Compliance & A11y Audit` runs on push and uploads `a11y-report` artifact. Fails on threshold.

## License

MIT

