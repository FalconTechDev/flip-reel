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

Add a `## x.y.z` section to [CHANGELOG.md](CHANGELOG.md), then run:

```bash
pnpm release patch
```

The script (`scripts/release.mjs`) bumps every workspace version, the runtime version constant
and the README install snippet, runs lint + typecheck + tests + build, and creates the
`chore: release x.y.z` commit with a `vx.y.z` tag. It never pushes — review, then
`git push origin main && git push origin vx.y.z`. The tag push triggers the release workflow,
which publishes the public packages to npm via trusted publishing.
