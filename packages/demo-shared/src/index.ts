import type { FlipReelOptions } from '@flipatic/flip-reel'
import { demoFeed } from './feed'
import { createHouseAdAdapter } from './house-ad'

export { demoFeed } from './feed'
export { createHouseAdAdapter } from './house-ad'

/** Shared widget options used by every framework demo, so each example stays
 *  focused on the framework wiring rather than re-declaring the config. */
export function createDemoOptions(overrides: Partial<FlipReelOptions> = {}): FlipReelOptions {
  return {
    feed: demoFeed,
    locale: 'en',
    brand: 'FlipReel',
    brandLogo: '/brand/flip-reel-logo.svg',
    rail: { maxVisible: 10, scrollBy: 4 },
    player: { loop: true, autoplayMuted: true, showReadMore: true },
    ads: { enabled: true, every: 4, durationMs: 5000, skippableAfterFirstView: true },
    interactions: { like: true, share: true },
    adapters: { ad: createHouseAdAdapter() },
    ...overrides,
  }
}
