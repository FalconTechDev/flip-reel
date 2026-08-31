import { describe, expect, it } from 'vitest'
import { normalizeFeed } from './feed-normalizer'

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
