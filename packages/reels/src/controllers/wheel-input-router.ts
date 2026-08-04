const BURST_GAP_MS = 200
const STEPPED_STICKY_MS = 2500
const WHEEL_AFTERGLOW_MS = 5000
const NOTCH_DELTA_MIN = 60

const WINDOW_MS = 2000
const NOTCH_MATCH_COUNT = 3
const NOTCH_TIGHT_GAP_MS = 10
const NOTCH_TIGHT_SPREAD = 4
const NOTCH_TIGHT_SUM_MIN = 60
const NOTCH_SPARSE_GAP_MS = 48
const NOTCH_SPARSE_SUM_MIN = 12

export type WheelRoute = 'native' | 'step' | 'blocked'

interface WheelSample {
  delta: number
  at: number
}

export class WheelInputRouter {
  private mode: 'native' | 'stepped' | null = null
  private blocked = false
  private lastEventTime = Number.NEGATIVE_INFINITY
  private lastStepTime = Number.NEGATIVE_INFINITY
  private recent: WheelSample[] = []

  route(deltaY: number, deltaMode: number, now: number): WheelRoute {
    const gap = now - this.lastEventTime
    this.lastEventTime = now

    if (gap > BURST_GAP_MS) this.blocked = false
    if (this.mode === 'stepped' && gap > STEPPED_STICKY_MS) this.mode = null
    if (this.mode === 'native' && gap > BURST_GAP_MS) this.mode = null

    this.recent = this.recent.filter((sample) => now - sample.at <= WINDOW_MS)
    this.recent.push({ delta: deltaY, at: now })

    if (this.blocked) return 'blocked'
    if (this.mode === 'stepped') return this.step(now)
    if (this.mode === 'native') return 'native'

    const burstStart = gap > BURST_GAP_MS
    const obviousNotch = deltaMode !== 0 || Math.abs(deltaY) >= NOTCH_DELTA_MIN
    const afterglow = now - this.lastStepTime <= WHEEL_AFTERGLOW_MS
    if (burstStart && (obviousNotch || afterglow)) return this.step(now)

    if (this.recentLooksLikeNotches()) return this.step(now)

    return 'native'
  }

  blockBurst(): void {
    this.blocked = true
  }

  private step(now: number): WheelRoute {
    this.mode = 'stepped'
    this.lastStepTime = now
    return 'step'
  }

  private recentLooksLikeNotches(): boolean {
    const samples = this.recent.slice(-NOTCH_MATCH_COUNT)
    const first = samples[0]
    if (samples.length < NOTCH_MATCH_COUNT || !first) return false

    const direction = Math.sign(first.delta)
    if (!samples.every((sample) => Math.sign(sample.delta) === direction)) return false

    const magnitudes = samples.map((sample) => Math.abs(sample.delta))
    const spread = Math.max(...magnitudes) - Math.min(...magnitudes)
    const sum = magnitudes.reduce((total, value) => total + value, 0)

    const gaps = samples.slice(1).map((sample, index) => {
      const previous = samples[index]
      return previous ? sample.at - previous.at : 0
    })
    const tight = gaps.every((value) => value <= NOTCH_TIGHT_GAP_MS)
    const sparse = gaps.every((value) => value >= NOTCH_SPARSE_GAP_MS)

    if (tight) return spread <= NOTCH_TIGHT_SPREAD && sum >= NOTCH_TIGHT_SUM_MIN
    if (sparse) return sum >= NOTCH_SPARSE_SUM_MIN
    return false
  }
}
