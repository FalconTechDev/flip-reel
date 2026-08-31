import { describe, expect, it, vi } from 'vitest'
import { EventBus } from './event-bus'

interface TestEvents {
  ping: { value: number }
}

describe('EventBus', () => {
  it('delivers payloads to subscribed listeners', () => {
    const bus = new EventBus<TestEvents>()
    const listener = vi.fn()
    bus.on('ping', listener)
    bus.emit('ping', { value: 1 })
    expect(listener).toHaveBeenCalledWith({ value: 1 })
  })

  it('stops delivering after unsubscribe', () => {
    const bus = new EventBus<TestEvents>()
    const listener = vi.fn()
    const off = bus.on('ping', listener)
    off()
    bus.emit('ping', { value: 1 })
    expect(listener).not.toHaveBeenCalled()
  })

  it('stops delivering after off()', () => {
    const bus = new EventBus<TestEvents>()
    const listener = vi.fn()
    bus.on('ping', listener)
    bus.off('ping', listener)
    bus.emit('ping', { value: 1 })
    expect(listener).not.toHaveBeenCalled()
  })

  it('clear() removes every listener', () => {
    const bus = new EventBus<TestEvents>()
    const listener = vi.fn()
    bus.on('ping', listener)
    bus.clear()
    bus.emit('ping', { value: 1 })
    expect(listener).not.toHaveBeenCalled()
  })

  it('emitCancelable returns true without listeners', () => {
    const bus = new EventBus<TestEvents>()
    expect(bus.emitCancelable('ping', { value: 1 })).toBe(true)
  })

  it('emitCancelable returns true when listeners return nothing', () => {
    const bus = new EventBus<TestEvents>()
    bus.on('ping', () => {})
    expect(bus.emitCancelable('ping', { value: 1 })).toBe(true)
  })

  it('emitCancelable returns false when any listener returns false', () => {
    const bus = new EventBus<TestEvents>()
    bus.on('ping', () => {})
    bus.on('ping', () => false)
    expect(bus.emitCancelable('ping', { value: 1 })).toBe(false)
  })

  it('emitCancelable still calls every listener after cancellation', () => {
    const bus = new EventBus<TestEvents>()
    const late = vi.fn()
    bus.on('ping', () => false)
    bus.on('ping', late)
    bus.emitCancelable('ping', { value: 1 })
    expect(late).toHaveBeenCalledOnce()
  })
})
