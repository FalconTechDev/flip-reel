/** Subsystem an error event originates from. */
export type FlipReelErrorScope = 'feed' | 'player' | 'ads'

/**
 * Every event the widget emits, keyed by event name. Each event fires on the
 * internal bus and is forwarded as a bubbling, composed `CustomEvent` whose
 * `detail` is the mapped payload.
 */
export interface FlipReelEventMap {
  /** The feed loaded and the widget is interactive. */
  'flip-reel:ready': { instanceId: string }
  /** The full-screen player opened. */
  'flip-reel:open': { storyId: string; index: number }
  /** The full-screen player closed. */
  'flip-reel:close': { storyId: string | null }
  /** A story became the active slide. */
  'flip-reel:view': { storyId: string; index: number }
  /** Playback resumed. */
  'flip-reel:play': { storyId: string }
  /** Playback paused. */
  'flip-reel:pause': { storyId: string }
  /** The viewer liked or unliked a story. */
  'flip-reel:like': { storyId: string; liked: boolean }
  /** The viewer used the share button. */
  'flip-reel:share': { storyId: string }
  /**
   * The viewer clicked the "read more" call to action. Cancelable: calling
   * `preventDefault()` stops the link navigation.
   */
  'flip-reel:readmore': { storyId: string; link?: string }
  /** Something failed; the widget degrades instead of throwing. */
  'flip-reel:error': { scope: FlipReelErrorScope; message: string }
  /** An ad break started and a creative was requested. */
  'flip-reel:ad:requested': { index: number }
  /** The ad creative rendered and counted an impression. */
  'flip-reel:ad:impression': { index: number }
  /** The ad played to completion. */
  'flip-reel:ad:completed': { index: number }
  /** The viewer skipped the ad. */
  'flip-reel:ad:skipped': { index: number }
  /** The ad adapter reported a no-fill and the break was dismissed. */
  'flip-reel:ad:empty': { index: number }
}

/** Union of all widget event names. */
export type FlipReelEventName = keyof FlipReelEventMap

/** The `CustomEvent` dispatched for a given widget event name. */
export type FlipReelEvent<K extends FlipReelEventName = FlipReelEventName> = CustomEvent<
  FlipReelEventMap[K]
>

type FlipReelDomEventMap = {
  [K in FlipReelEventName]: CustomEvent<FlipReelEventMap[K]>
}

declare global {
  interface HTMLElementEventMap extends FlipReelDomEventMap {}
  interface DocumentEventMap extends FlipReelDomEventMap {}
  interface WindowEventMap extends FlipReelDomEventMap {}
}
