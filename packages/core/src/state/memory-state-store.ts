import type { StateStore } from '../types/adapters'

export class MemoryStateStore implements StateStore {
  private readonly entries = new Map<string, unknown>()

  get<T>(key: string): T | undefined {
    return this.entries.get(key) as T | undefined
  }

  set<T>(key: string, value: T): void {
    this.entries.set(key, value)
  }

  remove(key: string): void {
    this.entries.delete(key)
  }
}
