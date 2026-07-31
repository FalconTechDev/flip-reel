export class Ticker {
  private rafId = 0
  private last = 0
  private running = false

  constructor(private readonly onTick: (deltaMs: number) => void) {}

  start(): void {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    this.rafId = requestAnimationFrame(this.loop)
  }

  stop(): void {
    this.running = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = 0
  }

  private readonly loop = (now: number): void => {
    if (!this.running) return
    const delta = now - this.last
    this.last = now
    this.onTick(delta)
    this.rafId = requestAnimationFrame(this.loop)
  }
}
