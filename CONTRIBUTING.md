# Contributing

Thanks for helping out. The repo is a pnpm + Turborepo monorepo.

## Setup

```bash
pnpm install
pnpm dev
```

## Before you push

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm format
```

A change isn't done while any of these fail.

## Branches & PRs

- Short-lived `feature/*` / `fix/*` branches off `main`.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`…).
- Open a PR; squash merge once CI is green.

## Releasing

Bump versions, update [CHANGELOG.md](CHANGELOG.md), then publish the public packages
(`pnpm -r --filter "./packages/*" publish --access public`).
