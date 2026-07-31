# FlipReel

Open-source, embeddable stories/reels widget for publishers. See
[docs/architecture.md](docs/architecture.md) for the architecture and all locked decisions
(Lit + Shadow DOM, headless core, adapter contracts, Apache-2.0, pnpm + Turborepo monorepo).

## Working conventions

### Code style

- **No comments.** Code is self-explanatory through naming and structure — no explanatory,
  section, or TODO comments.
- **English only in code.** Identifiers, string literals, file names, and any text in source
  files are English. No Polish in code.

### Code design

- **File size**: target 100–200 lines. Warn at 200–300. **Refactor at 300+ (hard rule).**
- **Functions/methods under 50 lines** — extract helpers beyond that.
- **Naming states the role**: every unit of logic is noun + role (`PlayerController`,
  `FeedLoader`, `WheelInputRouter`) — never a vague catch-all (`Helper`, `Utils`, `Manager`,
  `Common`).
- **One responsibility per unit** (element, controller, module, class). DRY: the same
  logic written twice → extract it into a shared unit.

### After every change

Leave the tree clean. From the repo root, after editing:

```bash
pnpm lint && pnpm typecheck && pnpm format
```

These back onto Prettier (`lint` = `prettier --check`, `format` = `prettier --write`) and `tsc`.
Fix whatever they report — a task isn't done while lint, typecheck, or formatting fail.

### Git

- **Never commit and never push.** Leave changes in the working tree for review.
- End every task with a **suggested commit message** as text: very short (a few words, to the
  point), English, Conventional Commits format — e.g. `feat: add intake form`.
- No co-authors or tool attribution in commits (enforced via `.claude/settings.json`).
