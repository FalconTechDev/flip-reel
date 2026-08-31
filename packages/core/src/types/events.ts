export type FlipReelErrorScope = 'feed' | 'player' | 'ads'

export interface FlipReelEventMap {
  'flip-reel:ready': { instanceId: string }
  'flip-reel:open': { storyId: string; index: number }
  'flip-reel:close': { storyId: string | null }
  'flip-reel:view': { storyId: string; index: number }
  'flip-reel:play': { storyId: string }
  'flip-reel:pause': { storyId: string }
  'flip-reel:like': { storyId: string; liked: boolean }
  'flip-reel:share': { storyId: string }
  'flip-reel:readmore': { storyId: string; link?: string }
  'flip-reel:error': { scope: FlipReelErrorScope; message: string }
  'flip-reel:ad:requested': { index: number }
  'flip-reel:ad:impression': { index: number }
  'flip-reel:ad:completed': { index: number }
  'flip-reel:ad:skipped': { index: number }
  'flip-reel:ad:empty': { index: number }
}

export type FlipReelEventName = keyof FlipReelEventMap

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
