type Listener<T> = (payload: T) => void | boolean

export class EventBus<EventMap> {
  private readonly listeners = new Map<keyof EventMap, Set<Listener<unknown>>>()

  on<K extends keyof EventMap>(type: K, listener: Listener<EventMap[K]>): () => void {
    const set = this.listeners.get(type) ?? new Set<Listener<unknown>>()
    set.add(listener as Listener<unknown>)
    this.listeners.set(type, set)
    return () => this.off(type, listener)
  }

  off<K extends keyof EventMap>(type: K, listener: Listener<EventMap[K]>): void {
    this.listeners.get(type)?.delete(listener as Listener<unknown>)
  }

  emit<K extends keyof EventMap>(type: K, payload: EventMap[K]): void {
    const set = this.listeners.get(type)
    if (!set) return
    for (const listener of Array.from(set)) {
      ;(listener as Listener<EventMap[K]>)(payload)
    }
  }

  emitCancelable<K extends keyof EventMap>(type: K, payload: EventMap[K]): boolean {
    const set = this.listeners.get(type)
    if (!set) return true
    let allowed = true
    for (const listener of Array.from(set)) {
      if ((listener as Listener<EventMap[K]>)(payload) === false) allowed = false
    }
    return allowed
  }

  clear(): void {
    this.listeners.clear()
  }
}
