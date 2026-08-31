import { en } from './en'
import { pl } from './pl'
import type { Messages } from './messages'

const catalog: Record<string, Messages> = { en, pl }

/**
 * Returns the UI message catalog for a locale (`en` and `pl` are built in).
 * Regional variants collapse to their language; unknown locales fall back to
 * English.
 */
export function getMessages(locale: string): Messages {
  const normalized = locale.toLowerCase().split('-')[0] ?? 'en'
  return catalog[normalized] ?? en
}

export type { Messages }
