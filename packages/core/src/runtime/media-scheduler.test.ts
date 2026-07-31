import { describe, expect, it } from 'vitest'
import { LeasePriority, MediaScheduler } from './media-scheduler'

describe('MediaScheduler', () => {
  it('evicts the weakest lease when a stronger request arrives at capacity', () => {
    const scheduler = new MediaScheduler(1)
    let revoked = false
    const preload = scheduler.request({
      priority: LeasePriority.PRELOAD,
      onRevoked: () => {
        revoked = true
      },
    })
    expect(preload).not.toBeNull()
    const active = scheduler.request({
      priority: LeasePriority.PLAYER_ACTIVE,
      onRevoked: () => {},
    })
    expect(active).not.toBeNull()
    expect(revoked).toBe(true)
  })

  it('refuses a weaker request when full', () => {
    const scheduler = new MediaScheduler(1)
    scheduler.request({ priority: LeasePriority.IN_VIEW, onRevoked: () => {} })
    const weaker = scheduler.request({ priority: LeasePriority.PRELOAD, onRevoked: () => {} })
    expect(weaker).toBeNull()
  })
})
