const BURST_GAP_MS = 200
const NOTCH_DELTA_MIN = 60

export type WheelRoute = 'native' | 'step' | 'swallow' | 'blocked'

export class WheelInputRouter {
  private mode: 'native' | 'stepped' | null = null
  private blocked = false
  private lastEventTime = Number.NEGATIVE_INFINITY

  route(deltaY: number, deltaMode: number, now: number): WheelRoute {
    const gap = now - this.lastEventTime
    this.lastEventTime = now
    if (gap > BURST_GAP_MS) {
      this.mode = null
      this.blocked = false
    }
    const notch = deltaMode !== 0 || Math.abs(deltaY) >= NOTCH_DELTA_MIN
    if (this.mode === null) this.mode = notch ? 'stepped' : 'native'
    if (this.blocked) return 'blocked'
    if (this.mode === 'native') return 'native'
    return notch ? 'step' : 'swallow'
  }

  blockBurst(): void {
    this.blocked = true
  }
}
