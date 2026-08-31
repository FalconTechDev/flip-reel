import { describe, expect, it } from 'vitest'
import { getMessages } from './i18n'
import { en } from './en'
import { pl } from './pl'

describe('getMessages', () => {
  it('returns the Polish catalog for pl', () => {
    expect(getMessages('pl')).toBe(pl)
  })

  it('normalizes regional locales', () => {
    expect(getMessages('pl-PL')).toBe(pl)
    expect(getMessages('en-US')).toBe(en)
  })

  it('ignores casing', () => {
    expect(getMessages('PL')).toBe(pl)
  })

  it('falls back to English for unknown locales', () => {
    expect(getMessages('de')).toBe(en)
    expect(getMessages('')).toBe(en)
  })
})
