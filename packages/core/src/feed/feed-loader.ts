import { FeedLoadError } from '../config/config-errors'
import { normalizeFeed } from './feed-normalizer'
import type { Category, Feed } from '../types/story'
import type { FeedAdapter, FeedSource } from '../types/adapters'

/** Options for {@link DefaultFeedAdapter}. */
export interface FeedLoaderOptions {
  /** Localized label for the "all" category. */
  allLabel: string
  /** Explicit categories overriding feed-provided or derived ones. */
  categories?: Category[]
}

/**
 * Built-in {@link FeedAdapter}: fetches URL sources without credentials,
 * invokes function sources, and normalizes the result via {@link normalizeFeed}.
 */
export class DefaultFeedAdapter implements FeedAdapter {
  constructor(private readonly options: FeedLoaderOptions) {}

  async load(source: FeedSource): Promise<Feed> {
    const raw = await this.fetchRaw(source)
    return normalizeFeed(raw, this.options.allLabel, this.options.categories)
  }

  private async fetchRaw(source: FeedSource): Promise<unknown> {
    if (typeof source === 'function') {
      return source()
    }
    if (typeof source === 'string') {
      const response = await fetch(source, { credentials: 'omit' })
      if (!response.ok) {
        throw new FeedLoadError(`Feed request failed with status ${response.status}`)
      }
      return response.json()
    }
    return source
  }
}
