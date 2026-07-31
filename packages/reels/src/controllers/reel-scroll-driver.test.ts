import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ReelScrollDriver } from './reel-scroll-driver'

interface FakeScroller {
  scrollTop: number
  clientHeight: number
  style: { scrollSnapType: string; removeProperty(name: string): void }
}

let nowMs = 0
let frameId = 0
const frames = new Map<number, FrameRequestCallback>()
let reducedMotion = false

function fakeScroller(): FakeScroller {
  const style = {
    scrollSnapType: '',
    removeProperty(name: string) {
      if (name === 'scroll-snap-type') style.scrollSnapType = ''
    },
  }
  return { scrollTop: 0, clientHeight: 848, style }
}

function fakeReel(index: number, offsetTop: number): HTMLElement {
  return {
    offsetTop,
    offsetHeight: 848,
    dataset: { index: String(index) },
    style: { opacity: '' },
  } as unknown as HTMLElement
}

function buildDriver(scroller: FakeScroller, reelCount = 3) {
  const reels = Array.from({ length: reelCount }, (_, index) => fakeReel(index, 64 + index * 912))
  return new ReelScrollDriver({
    scroller: () => scroller as unknown as HTMLElement,
    reels: () => reels,
  })
}

function runFrames(stepMs: number, maxFrames = 200): void {
  for (let i = 0; i < maxFrames && frames.size > 0; i += 1) {
    nowMs += stepMs
    const pending = Array.from(frames.values())
    frames.clear()
    for (const callback of pending) callback(nowMs)
  }
}

beforeEach(() => {
  nowMs = 0
  frameId = 0
  reducedMotion = false
  frames.clear()
  vi.stubGlobal('performance', { now: () => nowMs })
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frameId += 1
    frames.set(frameId, callback)
    return frameId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.stubGlobal('getComputedStyle', () => ({ scrollPaddingTop: '64px' }))
  vi.stubGlobal('window', { matchMedia: () => ({ matches: reducedMotion }) })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ReelScrollDriver', () => {
  it('resolves the nearest index from the scroll position', () => {
    const scroller = fakeScroller()
    const driver = buildDriver(scroller)
    scroller.scrollTop = 900
    expect(driver.nearestIndex()).toBe(1)
    scroller.scrollTop = 40
    expect(driver.nearestIndex()).toBe(0)
  })

  it('computes snap tops from reel offsets and scroll padding', () => {
    const driver = buildDriver(fakeScroller())
    expect(driver.snapTop(0)).toBe(0)
    expect(driver.snapTop(2)).toBe(1824)
    expect(driver.snapTop(5)).toBe(5 * 912)
  })

  it('reports atIndex within the snap epsilon only', () => {
    const scroller = fakeScroller()
    const driver = buildDriver(scroller)
    scroller.scrollTop = 1824 + 4
    expect(driver.atIndex(2)).toBe(true)
    scroller.scrollTop = 1824 + 5
    expect(driver.atIndex(2)).toBe(false)
  })

  it('animates to the exact snap position and lands once', () => {
    const scroller = fakeScroller()
    const driver = buildDriver(scroller)
    let landed = 0
    driver.animateTo(1, () => (landed += 1))
    expect(driver.isAnimating).toBe(true)
    expect(scroller.style.scrollSnapType).toBe('none')
    runFrames(16)
    expect(scroller.scrollTop).toBe(912)
    expect(landed).toBe(1)
    expect(driver.isAnimating).toBe(false)
    expect(scroller.style.scrollSnapType).toBe('')
  })

  it('retargets mid-flight and lands only at the final index', () => {
    const scroller = fakeScroller()
    const driver = buildDriver(scroller)
    const landings: number[] = []
    driver.animateTo(1, () => landings.push(1))
    nowMs += 200
    const pending = Array.from(frames.values())
    frames.clear()
    for (const callback of pending) callback(nowMs)
    driver.animateTo(2, () => landings.push(2))
    expect(driver.animationTarget).toBe(2)
    runFrames(16)
    expect(scroller.scrollTop).toBe(1824)
    expect(landings).toEqual([2])
    expect(scroller.style.scrollSnapType).toBe('')
  })

  it('cancels a flight without landing and restores native snapping', () => {
    const scroller = fakeScroller()
    const driver = buildDriver(scroller)
    let landed = 0
    driver.animateTo(1, () => (landed += 1))
    driver.cancel()
    runFrames(16)
    expect(landed).toBe(0)
    expect(driver.isAnimating).toBe(false)
    expect(scroller.style.scrollSnapType).toBe('')
  })

  it('jumps instantly and aborts any running animation', () => {
    const scroller = fakeScroller()
    const driver = buildDriver(scroller)
    driver.animateTo(2)
    driver.jumpTo(1)
    expect(scroller.scrollTop).toBe(912)
    expect(driver.isAnimating).toBe(false)
    runFrames(16)
    expect(scroller.scrollTop).toBe(912)
  })

  it('lands immediately when already at the target position', () => {
    const scroller = fakeScroller()
    const driver = buildDriver(scroller)
    scroller.scrollTop = 912
    let landed = 0
    driver.animateTo(1, () => (landed += 1))
    expect(landed).toBe(1)
    expect(driver.isAnimating).toBe(false)
  })

  it('jumps without animation under reduced motion', () => {
    reducedMotion = true
    const scroller = fakeScroller()
    const driver = buildDriver(scroller)
    let landed = 0
    driver.animateTo(2, () => (landed += 1))
    expect(scroller.scrollTop).toBe(1824)
    expect(landed).toBe(1)
    expect(driver.isAnimating).toBe(false)
  })
})
