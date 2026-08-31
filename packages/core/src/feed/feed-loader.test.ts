import { afterEach, describe, expect, it, vi } from 'vitest'
import { DefaultFeedAdapter } from './feed-loader'
import { FeedLoadError } from '../config/config-errors'
import type { Feed } from '../types/story'

const feed: Feed = {
  stories: [{ id: 's1', title: 'Story', category: 'news', type: 'video', video: 'v.mp4' }],
}

const adapter = new DefaultFeedAdapter({ allLabel: 'All' })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('DefaultFeedAdapter', () => {
  it('normalizes an inline feed object', async () => {
    const result = await adapter.load(feed)
    expect(result.stories).toHaveLength(1)
    expect(result.categories?.[0]).toEqual({ id: 'all', label: 'All' })
  })

  it('invokes a feed factory function', async () => {
    const source = vi.fn(async () => feed)
    const result = await adapter.load(source)
    expect(source).toHaveBeenCalledOnce()
    expect(result.stories[0]?.id).toBe('s1')
  })

  it('fetches a URL source without credentials', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => feed }))
    vi.stubGlobal('fetch', fetchMock)
    const result = await adapter.load('https://publisher.example/reels.json')
    expect(fetchMock).toHaveBeenCalledWith('https://publisher.example/reels.json', {
      credentials: 'omit',
    })
    expect(result.stories).toHaveLength(1)
  })

  it('throws FeedLoadError with the status of a failed request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 404 })),
    )
    await expect(adapter.load('https://publisher.example/missing.json')).rejects.toThrow(
      'Feed request failed with status 404',
    )
  })

  it('applies configured categories as an override', async () => {
    const withCategories = new DefaultFeedAdapter({
      allLabel: 'All',
      categories: [{ id: 'news', label: 'News' }],
    })
    const result = await withCategories.load(feed)
    expect(result.categories).toEqual([
      { id: 'all', label: 'All' },
      { id: 'news', label: 'News' },
    ])
  })

  it('wraps invalid payloads in FeedLoadError', async () => {
    await expect(adapter.load({ stories: 'nope' } as unknown as Feed)).rejects.toBeInstanceOf(
      FeedLoadError,
    )
  })
})
