import type { Feed, Story } from './story'

/**
 * Where the widget gets its stories from: a JSON URL (fetched without
 * credentials), an inline {@link Feed} object, or a factory returning one.
 */
export type FeedSource = string | Feed | (() => Feed | Promise<Feed>)

/** Creative format requested from an ad adapter. */
export type AdFormat = 'vertical-video' | 'display'

/** Everything an ad adapter needs to render one ad slot. */
export interface AdSlotContext {
  /** Zero-based index of the ad break within the session. */
  index: number
  /** Element the adapter should render the creative into. */
  container: HTMLElement
  /** Requested creative format. */
  format: AdFormat
  /** Active widget locale, e.g. `en` or `pl`. */
  locale: string
  /** Host-page consent payload, passed through untouched. */
  consent?: unknown
}

/** A rendered ad returned by an {@link AdAdapter}. */
export interface AdHandle {
  /** Overrides the configured ad duration for this creative, in milliseconds. */
  durationMs?: number
  /** Makes the skip button appear after this many milliseconds. */
  skippableAfterMs?: number
  /** Re-renders the creative in place. */
  refresh?: () => void
  /** Called when the widget counts the impression. */
  onImpression?: () => void
  /** Tears the creative down and releases its resources. */
  destroy: () => void
}

/**
 * Contract for plugging arbitrary ad tech into the player's ad breaks.
 * Resolve with `null` to report a no-fill.
 */
export interface AdAdapter {
  request(context: AdSlotContext): Promise<AdHandle | null>
}

/** Contract for custom feed loading, replacing the built-in fetch + normalize. */
export interface FeedAdapter {
  load(source: FeedSource): Promise<Feed>
}

/**
 * Minimal key-value persistence used for cross-session state such as the
 * ad skip gate. Implementations must never throw.
 */
export interface StateStore {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T): void
  remove(key: string): void
}

/** A story paired with its position in the current playlist. */
export interface StorySelection {
  story: Story
  index: number
}
