import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { LeasePriorityValue, MediaLease, MediaScheduler } from '@flipatic/flip-reel-core'

export class VideoLeaseController implements ReactiveController {
  private lease: MediaLease | null = null

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly scheduler: MediaScheduler,
    private readonly onRevoked: () => void,
  ) {
    host.addController(this)
  }

  hostDisconnected(): void {
    this.release()
  }

  acquire(priority: LeasePriorityValue): boolean {
    if (this.lease) return true
    this.lease = this.scheduler.request({
      priority,
      onRevoked: () => {
        this.lease = null
        this.onRevoked()
        this.host.requestUpdate()
      },
    })
    return this.lease !== null
  }

  get active(): boolean {
    return this.lease !== null
  }

  release(): void {
    if (this.lease) {
      this.lease.release()
      this.lease = null
    }
  }
}
