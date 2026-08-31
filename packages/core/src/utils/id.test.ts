import { describe, expect, it } from 'vitest'
import { createInstanceId } from './id'

describe('createInstanceId', () => {
  it('prefixes ids with the widget namespace', () => {
    expect(createInstanceId()).toMatch(/^flip-reel-/)
  })

  it('returns a distinct id on every call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => createInstanceId()))
    expect(ids.size).toBe(100)
  })
})
