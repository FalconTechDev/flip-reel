import {
  DEFAULT_ADS,
  DEFAULT_INTERACTIONS,
  DEFAULT_LOCALE,
  DEFAULT_PLAYER,
  DEFAULT_RAIL,
} from './config-defaults'
import { FlipReelConfigError } from './config-errors'
import type { FlipReelOptions, ResolvedConfig } from '../types/config'

function atLeast(value: number | undefined, fallback: number, min: number): number {
  const candidate = typeof value === 'number' && Number.isFinite(value) ? value : fallback
  return Math.max(min, candidate)
}

export function resolveConfig(options: FlipReelOptions): ResolvedConfig {
  if (!options || options.feed === undefined || options.feed === null) {
    throw new FlipReelConfigError('A "feed" source is required')
  }

  const rail = { ...DEFAULT_RAIL, ...options.rail }
  const player = { ...DEFAULT_PLAYER, ...options.player }
  const ads = { ...DEFAULT_ADS, ...options.ads }
  const interactions = { ...DEFAULT_INTERACTIONS, ...options.interactions }

  return {
    feed: options.feed,
    locale: options.locale ?? DEFAULT_LOCALE,
    brand: options.brand ?? 'FlipReel',
    brandLogo: options.brandLogo ?? null,
    categories: options.categories ?? null,
    rail: {
      heading: rail.heading,
      maxVisible: atLeast(rail.maxVisible, DEFAULT_RAIL.maxVisible, 1),
      scrollBy: atLeast(rail.scrollBy, DEFAULT_RAIL.scrollBy, 1),
      loop: rail.loop,
      hoverPreviewMs: atLeast(rail.hoverPreviewMs, DEFAULT_RAIL.hoverPreviewMs, 0),
    },
    player,
    ads: {
      enabled: ads.enabled,
      every: atLeast(ads.every, DEFAULT_ADS.every, 1),
      durationMs: atLeast(ads.durationMs, DEFAULT_ADS.durationMs, 0),
      skippableAfterFirstView: ads.skippableAfterFirstView,
      alwaysSkippable: ads.alwaysSkippable,
      noFillTimeoutMs: atLeast(ads.noFillTimeoutMs, DEFAULT_ADS.noFillTimeoutMs, 0),
    },
    interactions,
    theme: options.theme ?? {},
    adapters: options.adapters ?? {},
    callbacks: options.callbacks ?? {},
  }
}
