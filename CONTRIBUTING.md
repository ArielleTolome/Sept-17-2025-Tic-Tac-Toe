# Contributing Guide

Thanks for your interest in contributing to Nebula Tic-Tac-Toe! This project embraces collaboration across frontend, backend, DevOps, and testing. Please take a moment to review the workflow below before submitting changes.

## Development Workflow

1. **Fork & clone** the repository, then install dependencies:
   ```bash
   pnpm install
   ```
2. **Create a feature branch** with a descriptive name (e.g. `feat/socket-presence`).
3. **Run the stack** locally while you work:
   ```bash
   pnpm dev
   ```
4. **Add tests** for new behavior. Aim to keep coverage thresholds green (90% shared, 80% overall).
5. **Lint & type-check** before committing:
   ```bash
   pnpm lint
   pnpm typecheck
   ```
6. **Commit using Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.). Husky and Commitlint enforce this.
7. **Open a pull request** targeting `main`. Include a summary, screenshots for UI changes, and note any follow-up tasks.

## Pull Request Checklist

- [ ] Tests added or updated (`pnpm test`, `pnpm e2e`)
- [ ] Lint and type-check pass
- [ ] Documentation updated (README, docs, or comments) if behavior changed
- [ ] No snapshot or coverage regressions

## Project Structure

```
apps/
  api/   # Express + Prisma API, WebSockets, REST, OpenAPI
  web/   # React/Vite frontend, Zustand, Tailwind, Playwright
packages/
  shared/  # Shared types, Zod schemas, game logic, AI
```

## Reporting Issues

File bugs or feature ideas via GitHub issues. Please include:

- Reproduction steps
- Expected vs actual behavior
- Environment details (OS, Node version, browser)

## Security

See [SECURITY.md](SECURITY.md) for reporting security vulnerabilities.

Thank you for helping make Nebula Tic-Tac-Toe awesome!
