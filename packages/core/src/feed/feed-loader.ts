import { FeedLoadError } from '../config/config-errors'
import { normalizeFeed } from './feed-normalizer'
import type { Category, Feed } from '../types/story'
import type { FeedAdapter, FeedSource } from '../types/adapters'

export interface FeedLoaderOptions {
  allLabel: string
  categories?: Category[]
}

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
