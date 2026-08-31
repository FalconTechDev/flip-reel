import { afterEach, describe, expect, it, vi } from 'vitest'
import { canHover, hasSlowConnection, isIOS, prefersReducedMotion, prefersSaveData } from './device'

function stubNavigator(overrides: Record<string, unknown>): void {
  vi.stubGlobal('navigator', { userAgent: '', platform: '', maxTouchPoints: 0, ...overrides })
}

function stubMatchMedia(matchingQueries: string[]): void {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: matchingQueries.includes(query) }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isIOS', () => {
  it('detects an iPhone user agent', () => {
    stubNavigator({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' })
    expect(isIOS()).toBe(true)
  })

  it('detects an iPad user agent', () => {
    stubNavigator({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)' })
    expect(isIOS()).toBe(true)
  })

  it('detects iPadOS masquerading as macOS via touch points', () => {
    stubNavigator({ userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 5 })
    expect(isIOS()).toBe(true)
  })

  it('rejects a genuine macOS browser', () => {
    stubNavigator({ userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 0 })
    expect(isIOS()).toBe(false)
  })

  it('rejects an Android user agent', () => {
    stubNavigator({ userAgent: 'Mozilla/5.0 (Linux; Android 14)', platform: 'Linux armv8l' })
    expect(isIOS()).toBe(false)
  })

  it('returns false without a navigator', () => {
    vi.stubGlobal('navigator', undefined)
    expect(isIOS()).toBe(false)
  })
})

describe('canHover', () => {
  it('returns true for fine pointers with hover', () => {
    stubMatchMedia(['(hover: hover) and (pointer: fine)'])
    expect(canHover()).toBe(true)
  })

  it('returns false for touch-only devices', () => {
    stubMatchMedia([])
    expect(canHover()).toBe(false)
  })

  it('returns false without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(canHover()).toBe(false)
  })
})

describe('prefersReducedMotion', () => {
  it('mirrors the media query', () => {
    stubMatchMedia(['(prefers-reduced-motion: reduce)'])
    expect(prefersReducedMotion()).toBe(true)
  })

  it('returns false without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(prefersReducedMotion()).toBe(false)
  })
})

describe('prefersSaveData', () => {
  it('returns true when the connection requests data saving', () => {
    stubNavigator({ connection: { saveData: true } })
    expect(prefersSaveData()).toBe(true)
  })

  it('returns false without connection info', () => {
    stubNavigator({})
    expect(prefersSaveData()).toBe(false)
  })

  it('returns false without a navigator', () => {
    vi.stubGlobal('navigator', undefined)
    expect(prefersSaveData()).toBe(false)
  })
})

describe('hasSlowConnection', () => {
  it('flags 2g connections', () => {
    stubNavigator({ connection: { effectiveType: '2g' } })
    expect(hasSlowConnection()).toBe(true)
  })

  it('flags slow-2g connections', () => {
    stubNavigator({ connection: { effectiveType: 'slow-2g' } })
    expect(hasSlowConnection()).toBe(true)
  })

  it('passes 4g connections', () => {
    stubNavigator({ connection: { effectiveType: '4g' } })
    expect(hasSlowConnection()).toBe(false)
  })

  it('returns false without connection info', () => {
    stubNavigator({})
    expect(hasSlowConnection()).toBe(false)
  })
})
