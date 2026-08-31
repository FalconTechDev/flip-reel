import { isIOS } from '../utils/device'

/** Priority tiers for media playback leases; higher values evict lower ones. */
export const LeasePriority = {
  PRELOAD: 10,
  HOVER: 20,
  IN_VIEW: 30,
  PLAYER_ACTIVE: 40,
} as const

/** One of the {@link LeasePriority} tiers. */
export type LeasePriorityValue = (typeof LeasePriority)[keyof typeof LeasePriority]

/** A party asking to play media, with a callback fired when its lease is evicted. */
export interface LeaseHolder {
  priority: LeasePriorityValue
  onRevoked: () => void
}

/** A granted playback slot; call `release` when playback stops. */
export interface MediaLease {
  readonly holder: LeaseHolder
  release(): void
}

function detectBudget(): number {
  return isIOS() ? 2 : 3
}

/**
 * Page-global cap on concurrently playing media elements (2 on iOS, 3
 * elsewhere). Prevents multiple widget instances from starving each other.
 */
export class MediaScheduler {
  private readonly active = new Set<MediaLease>()

  constructor(private budget: number = detectBudget()) {}

  /**
   * Requests a playback slot. At capacity, evicts the weakest lower-priority
   * lease; returns `null` when no slot can be granted.
   */
  request(holder: LeaseHolder): MediaLease | null {
    if (this.active.size < this.budget) {
      return this.grant(holder)
    }
    const weakest = this.weakestActive()
    if (weakest && holder.priority > weakest.holder.priority) {
      this.revoke(weakest)
      return this.grant(holder)
    }
    return null
  }

  /** Changes the cap, evicting the weakest leases when shrinking. Minimum 1. */
  setBudget(budget: number): void {
    this.budget = Math.max(1, budget)
    while (this.active.size > this.budget) {
      const weakest = this.weakestActive()
      if (!weakest) break
      this.revoke(weakest)
    }
  }

  private grant(holder: LeaseHolder): MediaLease {
    const lease: MediaLease = {
      holder,
      release: () => {
        this.active.delete(lease)
      },
    }
    this.active.add(lease)
    return lease
  }

  private revoke(lease: MediaLease): void {
    this.active.delete(lease)
    lease.holder.onRevoked()
  }

  private weakestActive(): MediaLease | null {
    let weakest: MediaLease | null = null
    for (const lease of this.active) {
      if (!weakest || lease.holder.priority < weakest.holder.priority) {
        weakest = lease
      }
    }
    return weakest
  }
}
