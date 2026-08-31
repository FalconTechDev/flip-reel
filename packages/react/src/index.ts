import * as React from 'react'
import { createComponent } from '@lit/react'
import { FlipReelPlayer, FlipReelRail, FlipReelReels } from '@flipatic/flip-reel'

export const Reels = createComponent({
  tagName: 'flip-reel',
  elementClass: FlipReelReels,
  react: React,
  events: {
    onReady: 'flip-reel:ready',
    onOpen: 'flip-reel:open',
    onClose: 'flip-reel:close',
    onView: 'flip-reel:view',
    onLike: 'flip-reel:like',
    onShare: 'flip-reel:share',
    onReadMore: 'flip-reel:readmore',
    onReelsError: 'flip-reel:error',
    onAdImpression: 'flip-reel:ad:impression',
    onAdCompleted: 'flip-reel:ad:completed',
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
} from '@flipatic/flip-reel'
