import type { StateStore } from '../types/adapters'

/** State-store key marking that the viewer sat through one full ad. */
export const AD_GATE_KEY = 'ad:gate-passed'

/** Timing and skippability rules for {@link AdSession}. */
export interface AdSessionConfig {
  durationMs: number
  skippableAfterFirstView: boolean
  alwaysSkippable: boolean
}

/**
 * Countdown state of a single ad break: tracks remaining time and decides
 * skippability from the persisted first-view gate.
 */
export class AdSession {
  remainingMs = 0
  durationMs = 0
  skippable = false
  private finished = false

  constructor(
    private readonly config: AdSessionConfig,
    private readonly store: StateStore,
  ) {}

  /** Begins a break; an explicit duration overrides the configured one. */
  start(durationMs?: number): void {
    this.durationMs = durationMs ?? this.config.durationMs
    this.remainingMs = this.durationMs
    this.finished = false
    const gatePassed = this.store.get<boolean>(AD_GATE_KEY) === true
    this.skippable =
      this.config.alwaysSkippable || (this.config.skippableAfterFirstView && gatePassed)
  }

  /** Advances the countdown; returns `true` once the break has finished. */
  tick(deltaMs: number): boolean {
    if (this.finished) return true
    this.remainingMs = Math.max(0, this.remainingMs - deltaMs)
    if (this.remainingMs <= 0) {
      this.complete()
      return true
    }
    return false
  }

  /** Ends the break early; returns `false` while the ad is not skippable. */
  requestSkip(): boolean {
    if (!this.skippable || this.finished) return false
    this.finished = true
    return true
  }

  /** Marks the ad as fully watched and persists the skip gate. */
  complete(): void {
    if (this.finished) return
    this.finished = true
    this.store.set(AD_GATE_KEY, true)
  }

  get isFinished(): boolean {
    return this.finished
  }
}
