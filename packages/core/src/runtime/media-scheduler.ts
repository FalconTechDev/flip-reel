import { isIOS } from '../utils/device'

export const LeasePriority = {
  PRELOAD: 10,
  HOVER: 20,
  IN_VIEW: 30,
  PLAYER_ACTIVE: 40,
} as const

export type LeasePriorityValue = (typeof LeasePriority)[keyof typeof LeasePriority]

export interface LeaseHolder {
  priority: LeasePriorityValue
  onRevoked: () => void
}

export interface MediaLease {
  readonly holder: LeaseHolder
  release(): void
}

function detectBudget(): number {
  return isIOS() ? 2 : 3
}

export class MediaScheduler {
  private readonly active = new Set<MediaLease>()

  constructor(private budget: number = detectBudget()) {}

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
