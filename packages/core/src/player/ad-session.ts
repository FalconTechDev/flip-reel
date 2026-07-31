import type { StateStore } from '../types/adapters'

export const AD_GATE_KEY = 'ad:gate-passed'

export interface AdSessionConfig {
  durationMs: number
  skippableAfterFirstView: boolean
  alwaysSkippable: boolean
}

export class AdSession {
  remainingMs = 0
  durationMs = 0
  skippable = false
  private finished = false

  constructor(
    private readonly config: AdSessionConfig,
    private readonly store: StateStore,
  ) {}

  start(durationMs?: number): void {
    this.durationMs = durationMs ?? this.config.durationMs
    this.remainingMs = this.durationMs
    this.finished = false
    const gatePassed = this.store.get<boolean>(AD_GATE_KEY) === true
    this.skippable =
      this.config.alwaysSkippable || (this.config.skippableAfterFirstView && gatePassed)
  }

  tick(deltaMs: number): boolean {
    if (this.finished) return true
    this.remainingMs = Math.max(0, this.remainingMs - deltaMs)
    if (this.remainingMs <= 0) {
      this.complete()
      return true
    }
    return false
  }

  requestSkip(): boolean {
    if (!this.skippable || this.finished) return false
    this.finished = true
    return true
  }

  complete(): void {
    if (this.finished) return
    this.finished = true
    this.store.set(AD_GATE_KEY, true)
  }

  get isFinished(): boolean {
    return this.finished
  }
}
