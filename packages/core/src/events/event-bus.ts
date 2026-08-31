type Listener<T> = (payload: T) => void | boolean

/** Typed publish/subscribe bus keyed by an event-name-to-payload map. */
export class EventBus<EventMap> {
  private readonly listeners = new Map<keyof EventMap, Set<Listener<unknown>>>()

  /** Subscribes to an event; returns the matching unsubscribe function. */
  on<K extends keyof EventMap>(type: K, listener: Listener<EventMap[K]>): () => void {
    const set = this.listeners.get(type) ?? new Set<Listener<unknown>>()
    set.add(listener as Listener<unknown>)
    this.listeners.set(type, set)
    return () => this.off(type, listener)
  }

  /** Removes a previously subscribed listener. */
  off<K extends keyof EventMap>(type: K, listener: Listener<EventMap[K]>): void {
    this.listeners.get(type)?.delete(listener as Listener<unknown>)
  }

  /** Delivers a payload to every listener of the event. */
  emit<K extends keyof EventMap>(type: K, payload: EventMap[K]): void {
    const set = this.listeners.get(type)
    if (!set) return
    for (const listener of Array.from(set)) {
      ;(listener as Listener<EventMap[K]>)(payload)
    }
  }

  /**
   * Like {@link EventBus.emit}, but listeners may veto the default action by
   * returning `false`. Returns `false` when any listener did.
   */
  emitCancelable<K extends keyof EventMap>(type: K, payload: EventMap[K]): boolean {
    const set = this.listeners.get(type)
    if (!set) return true
    let allowed = true
    for (const listener of Array.from(set)) {
      if ((listener as Listener<EventMap[K]>)(payload) === false) allowed = false
    }
    return allowed
  }

  /** Drops every listener of every event. */
  clear(): void {
    this.listeners.clear()
  }
}
