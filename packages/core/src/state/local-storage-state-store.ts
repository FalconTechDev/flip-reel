import { MemoryStateStore } from './memory-state-store'
import type { StateStore } from '../types/adapters'

const PREFIX = 'flip-reel:v1:'

/**
 * {@link StateStore} backed by `localStorage` under a versioned `flip-reel:v1:`
 * prefix. Falls back to an in-memory store when `localStorage` is unavailable
 * and swallows quota or serialization errors.
 */
export function createLocalStorageStateStore(): StateStore {
  if (typeof localStorage === 'undefined') {
    return new MemoryStateStore()
  }

  return {
    get<T>(key: string): T | undefined {
      try {
        const raw = localStorage.getItem(PREFIX + key)
        return raw === null ? undefined : (JSON.parse(raw) as T)
      } catch {
        return undefined
      }
    },
    set<T>(key: string, value: T): void {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value))
      } catch {
        return
      }
    },
    remove(key: string): void {
      try {
        localStorage.removeItem(PREFIX + key)
      } catch {
        return
      }
    },
  }
}
