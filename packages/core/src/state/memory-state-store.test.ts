import { describe, expect, it } from 'vitest'
import { MemoryStateStore } from './memory-state-store'

describe('MemoryStateStore', () => {
  it('round-trips values', () => {
    const store = new MemoryStateStore()
    store.set('count', 3)
    expect(store.get<number>('count')).toBe(3)
  })

  it('returns undefined for missing keys', () => {
    const store = new MemoryStateStore()
    expect(store.get('missing')).toBeUndefined()
  })

  it('removes values', () => {
    const store = new MemoryStateStore()
    store.set('key', 'value')
    store.remove('key')
    expect(store.get('key')).toBeUndefined()
  })

  it('overwrites existing values', () => {
    const store = new MemoryStateStore()
    store.set('key', 'a')
    store.set('key', 'b')
    expect(store.get<string>('key')).toBe('b')
  })
})
