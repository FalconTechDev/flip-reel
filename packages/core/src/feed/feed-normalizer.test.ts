import { describe, expect, it } from 'vitest'
import { ALL_CATEGORY_ID, filterByCategory, normalizeFeed } from './feed-normalizer'
import { FeedLoadError } from '../config/config-errors'

function feedWithLink(link: unknown) {
  return { stories: [{ id: 's1', title: 'Story', type: 'video', video: 'v.mp4', link }] }
}

function normalizedLink(link: unknown): string | undefined {
  return normalizeFeed(feedWithLink(link), 'All').stories[0]?.link
}

describe('normalizeFeed link sanitization', () => {
  it('keeps https links', () => {
    expect(normalizedLink('https://publisher.example/article')).toBe(
      'https://publisher.example/article',
    )
  })

  it('keeps http links', () => {
    expect(normalizedLink('http://publisher.example/article')).toBe(
      'http://publisher.example/article',
    )
  })

  it('keeps relative links', () => {
    expect(normalizedLink('/articles/42')).toBe('/articles/42')
  })

  it('drops javascript: links', () => {
    expect(normalizedLink('javascript:alert(1)')).toBeUndefined()
  })

  it('drops data: links', () => {
    expect(normalizedLink('data:text/html,x')).toBeUndefined()
  })

  it('drops scheme-disguising whitespace links', () => {
    expect(normalizedLink(' java\tscript:alert(1)')).toBeUndefined()
  })

  it('drops non-string links', () => {
    expect(normalizedLink(123)).toBeUndefined()
  })

  it('leaves stories without a link untouched', () => {
    expect(normalizedLink(undefined)).toBeUndefined()
  })
})

describe('normalizeFeed story validation', () => {
  it('accepts a bare story array as the feed', () => {
    const feed = normalizeFeed(
      [{ id: 's1', title: 'Story', category: 'news', type: 'image', image: 'i.jpg' }],
      'All',
    )
    expect(feed.stories).toHaveLength(1)
  })

  it('filters out malformed stories', () => {
    const feed = normalizeFeed(
      {
        stories: [
          { id: 's1', title: 'Valid', category: 'news', type: 'video', video: 'v.mp4' },
          { id: 's2', title: 'No media', category: 'news', type: 'video' },
          { title: 'No id', category: 'news', type: 'image', image: 'i.jpg' },
          'garbage',
        ],
      },
      'All',
    )
    expect(feed.stories.map((story) => story.id)).toEqual(['s1'])
  })

  it('throws when stories are missing', () => {
    expect(() => normalizeFeed({}, 'All')).toThrow(FeedLoadError)
    expect(() => normalizeFeed(null, 'All')).toThrow(FeedLoadError)
  })

  it('throws when no story survives validation', () => {
    expect(() => normalizeFeed({ stories: [{ id: 'x' }] }, 'All')).toThrow(FeedLoadError)
  })
})

describe('normalizeFeed categories', () => {
  const stories = [
    { id: 's1', title: 'A', category: 'news', type: 'video', video: 'v.mp4' },
    { id: 's2', title: 'B', category: 'sport', type: 'video', video: 'v.mp4' },
    { id: 's3', title: 'C', category: 'news', type: 'video', video: 'v.mp4' },
  ]

  it('derives unique categories prefixed with the all category', () => {
    const feed = normalizeFeed({ stories }, 'All')
    expect(feed.categories).toEqual([
      { id: 'all', label: 'All' },
      { id: 'news', label: 'news' },
      { id: 'sport', label: 'sport' },
    ])
  })

  it('prepends the all category to explicit categories when missing', () => {
    const feed = normalizeFeed({ stories, categories: [{ id: 'news', label: 'News' }] }, 'All')
    expect(feed.categories?.[0]).toEqual({ id: 'all', label: 'All' })
  })

  it('keeps explicit categories that already include all', () => {
    const categories = [
      { id: 'all', label: 'Everything' },
      { id: 'news', label: 'News' },
    ]
    const feed = normalizeFeed({ stories, categories }, 'All')
    expect(feed.categories).toEqual(categories)
  })
})

describe('filterByCategory', () => {
  const stories = normalizeFeed(
    {
      stories: [
        { id: 's1', title: 'A', category: 'news', type: 'video', video: 'v.mp4' },
        { id: 's2', title: 'B', category: 'sport', type: 'video', video: 'v.mp4' },
      ],
    },
    'All',
  ).stories

  it('returns everything for the all category', () => {
    expect(filterByCategory(stories, ALL_CATEGORY_ID)).toHaveLength(2)
  })

  it('narrows to the requested category', () => {
    expect(filterByCategory(stories, 'sport').map((story) => story.id)).toEqual(['s2'])
  })
})
