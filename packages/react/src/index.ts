import * as React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { FlipReelPlayer, FlipReelRail, FlipReelReels } from '@flipatic/flip-reel'
import type { FlipReelEventMap, FlipReelEventName } from '@flipatic/flip-reel'

function eventName<K extends FlipReelEventName>(
  name: K,
): EventName<CustomEvent<FlipReelEventMap[K]>> {
  return name as EventName<CustomEvent<FlipReelEventMap[K]>>
}

/**
 * React wrapper for `<flip-reel>` — the complete widget. Pass
 * {@link FlipReelOptions} via `options`; every `flip-reel:*` event is exposed
 * as a typed `on*` prop receiving a `CustomEvent` (widget errors arrive on
 * `onReelsError`, since `onError` is a native React handler). Calling
 * `event.preventDefault()` in `onReadMore` stops the link navigation.
 */
export const Reels = createComponent({
  tagName: 'flip-reel',
  elementClass: FlipReelReels,
  react: React,
  events: {
    onReady: eventName('flip-reel:ready'),
    onOpen: eventName('flip-reel:open'),
    onClose: eventName('flip-reel:close'),
    onView: eventName('flip-reel:view'),
    onPlay: eventName('flip-reel:play'),
    onPause: eventName('flip-reel:pause'),
    onLike: eventName('flip-reel:like'),
    onShare: eventName('flip-reel:share'),
    onReadMore: eventName('flip-reel:readmore'),
    onReelsError: eventName('flip-reel:error'),
    onAdRequested: eventName('flip-reel:ad:requested'),
    onAdImpression: eventName('flip-reel:ad:impression'),
    onAdCompleted: eventName('flip-reel:ad:completed'),
    onAdSkipped: eventName('flip-reel:ad:skipped'),
    onAdEmpty: eventName('flip-reel:ad:empty'),
  },
})

/** React wrapper for `<flip-reel-rail>` — the standalone card rail. */
export const Rail = createComponent({
  tagName: 'flip-reel-rail',
  elementClass: FlipReelRail,
  react: React,
})

/** React wrapper for `<flip-reel-player>` — the standalone full-screen player. */
export const Player = createComponent({
  tagName: 'flip-reel-player',
  elementClass: FlipReelPlayer,
  react: React,
})

export type {
  FlipReelOptions,
  Story,
  Feed,
  Category,
  AdAdapter,
  FlipReelEventMap,
  FlipReelEventName,
  FlipReelEvent,
  FlipReelErrorScope,
} from '@flipatic/flip-reel'
