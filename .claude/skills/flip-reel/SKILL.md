---
name: flip-reel
description: Integrate, configure, and extend the FlipReel stories/reels widget on a publisher site. Use when embedding FlipReel, wiring its flip-reel:* events or React props, theming it through CSS custom properties, building feed/ad/state adapters, or debugging why the widget does not render or style as expected.
---

# Working with FlipReel

FlipReel is an embeddable stories/reels widget: Lit web components (Shadow DOM) over a
headless core. Ground truth lives in `docs/reference/` (options, events, elements, theming,
adapters, feed format, core API) and in TSDoc on every export — consult those files before
answering from memory.

## Embedding

Drop-in (any site):

```html
<script type="module" src="https://unpkg.com/@flipatic/flip-reel"></script>
<flip-reel feed="https://publisher.example/reels.json" locale="pl"></flip-reel>
```

Programmatic (`npm i @flipatic/flip-reel`):

```ts
import { mount } from '@flipatic/flip-reel'
mount(container, { feed: 'https://publisher.example/reels.json', ads: { every: 4 } })
```

React (`@flipatic/flip-reel-react`): `<Reels options={...} onView={...} />`. Vue/Svelte use
the custom element directly. Only `feed` is required; defaults for everything else are in
`docs/reference/options.md`.

## Events — the rules that matter

- All events are `flip-reel:*` bubbling `CustomEvent`s; payload types come from
  `FlipReelEventMap` and `addEventListener` is fully typed (global augmentation).
- `flip-reel:readmore` is **cancelable**: `event.preventDefault()` stops the story link from
  opening — use it to route navigation yourself.
- In React the error event prop is **`onReelsError`**, never `onError` (native React
  handler). Full prop-to-event table: `docs/reference/events.md`.
- Simple integrations can use `options.callbacks` (`onLike`, `onShare`, `onReadMore`)
  instead of DOM listeners.

## Styling

Host CSS cannot pierce the Shadow DOM. Theme exclusively via `--flip-reel-*` custom
properties set on the `flip-reel` element (or `options.theme`). The public knobs
(`--flip-reel-surface`, `--flip-reel-on-surface`, `--flip-reel-progress-fill`,
`--flip-reel-heading-color`, ...) and the full token list are in
`docs/reference/theming.md`. Never suggest `::part`, `!important`, or patching the bundle.

## Feeds and adapters

- Feed JSON: `{ stories: [...] }` with per-story `type: "video" | "image"`; invalid stories
  are dropped and non-http links stripped (`docs/reference/feed.md`).
- Custom loading → implement `FeedAdapter`; custom ad tech → `AdAdapter` (resolve `null` for
  no-fill); persistence → `StateStore`. Contracts in `docs/reference/adapters.md`; GPT
  reference adapter in `@flipatic/flip-reel-ad-gpt`.

## Debugging checklist

1. Widget empty → feed invalid or blocked: check `flip-reel:error` (scope `feed`), CORS, and
   that the feed passes the validation rules.
2. Events "not firing" → listen on the element (they bubble; `composed: true`), and verify
   the exact `flip-reel:*` name.
3. Styles ignored → the selector targets shadow content; move to CSS custom properties.
4. Videos not autoplaying → autoplay policy; keep `player.autoplayMuted: true`.
5. Two bundles on one page → console warns about a version mismatch (`getRuntime`).

## Conventions when changing this repo

Follow `CLAUDE.md`: no comments in code (TSDoc on exports is the exception), English-only
identifiers, files 100–200 lines, `pnpm lint && pnpm typecheck && pnpm format` before
finishing, never commit or push, and keep `docs/reference/` plus TSDoc in sync with any API
change.
