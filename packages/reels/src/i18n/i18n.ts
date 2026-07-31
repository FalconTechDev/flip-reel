import { en } from './en'
import { pl } from './pl'
import type { Messages } from './messages'

const catalog: Record<string, Messages> = { en, pl }

export function getMessages(locale: string): Messages {
  const normalized = locale.toLowerCase().split('-')[0] ?? 'en'
  return catalog[normalized] ?? en
}

export type { Messages }
