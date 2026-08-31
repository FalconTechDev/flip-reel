import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLocalStorageStateStore } from './local-storage-state-store'

function stubLocalStorage(overrides: Partial<Storage> = {}): Map<string, string> {
  const entries = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, value),
    removeItem: (key: string) => entries.delete(key),
    ...overrides,
  })
  return entries
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createLocalStorageStateStore', () => {
  it('round-trips JSON values under a versioned prefix', () => {
    const entries = stubLocalStorage()
    const store = createLocalStorageStateStore()
    store.set('gate', { passed: true })
    expect(entries.get('flip-reel:v1:gate')).toBe('{"passed":true}')
    expect(store.get<{ passed: boolean }>('gate')).toEqual({ passed: true })
  })

  it('removes values', () => {
    const entries = stubLocalStorage()
    const store = createLocalStorageStateStore()
    store.set('key', 1)
    store.remove('key')
    expect(entries.size).toBe(0)
    expect(store.get('key')).toBeUndefined()
  })

  it('returns undefined for corrupted entries', () => {
    const entries = stubLocalStorage()
    entries.set('flip-reel:v1:bad', '{not json')
    const store = createLocalStorageStateStore()
    expect(store.get('bad')).toBeUndefined()
  })

  it('swallows write errors, e.g. quota exceeded', () => {
    stubLocalStorage({
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    })
    const store = createLocalStorageStateStore()
    expect(() => store.set('key', 'value')).not.toThrow()
    expect(store.get('key')).toBeUndefined()
  })

  it('falls back to an in-memory store without localStorage', () => {
    const store = createLocalStorageStateStore()
    store.set('key', 'value')
    expect(store.get<string>('key')).toBe('value')
  })
})
