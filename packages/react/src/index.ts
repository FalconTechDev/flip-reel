import * as React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { FlipReelPlayer, FlipReelRail, FlipReelReels } from '@flipatic/flip-reel'
import type { FlipReelEventMap, FlipReelEventName } from '@flipatic/flip-reel'

function eventName<K extends FlipReelEventName>(
  name: K,
): EventName<CustomEvent<FlipReelEventMap[K]>> {
  return name as EventName<CustomEvent<FlipReelEventMap[K]>>
}

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

export const Rail = createComponent({
  tagName: 'flip-reel-rail',
  elementClass: FlipReelRail,
  react: React,
})

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
