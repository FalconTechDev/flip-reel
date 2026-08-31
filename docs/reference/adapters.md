# Adapters

Adapters are the widget's extension points, passed via `options.adapters`. All contracts live
in `@flipatic/flip-reel-core`.

## `FeedAdapter`

Replaces the built-in feed loading:

```ts
interface FeedAdapter {
  load(source: FeedSource): Promise<Feed>
}
```

The default (`DefaultFeedAdapter`) fetches URL sources without credentials, invokes function
sources, and normalizes everything through `normalizeFeed` (drops malformed stories, strips
non-http links, ensures the "all" category). A custom adapter takes over completely — return
a ready `Feed` and the widget renders it as-is.

## `AdAdapter`

Hosts arbitrary ad tech inside the player's ad breaks:

```ts
interface AdAdapter {
  request(context: AdSlotContext): Promise<AdHandle | null>
}

interface AdSlotContext {
  index: number // zero-based ad break index
  container: HTMLElement // render the creative into this element
  format: 'vertical-video' | 'display'
  locale: string
  consent?: unknown // host-page consent payload, passed through
}

interface AdHandle {
  durationMs?: number // override the configured ad duration
  skippableAfterMs?: number // show the skip button after this delay
  refresh?: () => void
  onImpression?: () => void
  destroy: () => void // required: tear the creative down
}
```

Resolve with `null` to signal a no-fill — the widget emits `flip-reel:ad:empty` and dismisses
the break. If the adapter neither renders nor resolves within `ads.noFillTimeoutMs`
(default 2500 ms), the slot is treated as no-fill too.

### Google Ad Manager reference adapter

```ts
import { createGptAdAdapter } from '@flipatic/flip-reel-ad-gpt'

const ad = createGptAdAdapter({
  adUnitPath: '/1234567/flip-reel',
  sizes: [[300, 250]], // default
  targeting: { placement: 'reels' },
  scriptUrl: undefined, // defaults to the official gpt.js
})
```

Loads `gpt.js` once on first request, defines one slot per break, destroys it on teardown,
and maps empty renders to no-fill.

## `StateStore`

Minimal key-value persistence for cross-session state (currently: the "viewer sat through one
full ad" gate that unlocks skippable ads):

```ts
interface StateStore {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T): void
  remove(key: string): void
}
```

Built-ins:

- `MemoryStateStore` — page-lifetime only; the default.
- `createLocalStorageStateStore()` — persists JSON under the `flip-reel:v1:` prefix, falls
  back to memory when `localStorage` is unavailable, and never throws.

Implementations must never throw — swallow quota and serialization errors.
