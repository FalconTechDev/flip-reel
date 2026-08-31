import { describe, expect, it } from 'vitest'
import { AD_GATE_KEY, AdSession } from './ad-session'
import { MemoryStateStore } from '../state/memory-state-store'

function buildSession(overrides: Partial<ConstructorParameters<typeof AdSession>[0]> = {}) {
  const store = new MemoryStateStore()
  const session = new AdSession(
    {
      durationMs: 5000,
      skippableAfterFirstView: true,
      alwaysSkippable: false,
      ...overrides,
    },
    store,
  )
  return { session, store }
}

describe('AdSession', () => {
  it('keeps the first ad non-skippable until the gate is passed', () => {
    const { session } = buildSession()
    session.start()
    expect(session.skippable).toBe(false)
    expect(session.remainingMs).toBe(5000)
  })

  it('opens the gate on completion, making the next ad skippable', () => {
    const { session, store } = buildSession()
    session.start()
    session.complete()
    expect(store.get<boolean>(AD_GATE_KEY)).toBe(true)
    session.start()
    expect(session.skippable).toBe(true)
  })

  it('is always skippable when configured so', () => {
    const { session } = buildSession({ alwaysSkippable: true })
    session.start()
    expect(session.skippable).toBe(true)
  })

  it('counts down through tick and finishes at zero', () => {
    const { session } = buildSession()
    session.start()
    expect(session.tick(3000)).toBe(false)
    expect(session.remainingMs).toBe(2000)
    expect(session.tick(2000)).toBe(true)
    expect(session.isFinished).toBe(true)
  })

  it('honors a per-ad duration override', () => {
    const { session } = buildSession()
    session.start(1000)
    expect(session.durationMs).toBe(1000)
    expect(session.tick(1000)).toBe(true)
  })

  it('refuses skip while non-skippable and accepts it once skippable', () => {
    const { session } = buildSession()
    session.start()
    expect(session.requestSkip()).toBe(false)
    session.complete()
    session.start()
    expect(session.requestSkip()).toBe(true)
    expect(session.requestSkip()).toBe(false)
  })

  it('skipping does not pass the gate', () => {
    const { session, store } = buildSession({ alwaysSkippable: true })
    session.start()
    session.requestSkip()
    expect(store.get<boolean>(AD_GATE_KEY)).toBeUndefined()
  })
})
