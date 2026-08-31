import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../config/config-resolver'
import { EventBus } from '../events/event-bus'
import { MemoryStateStore } from '../state/memory-state-store'
import { PlayerController } from './player-controller'
import type { FlipReelEventMap } from '../types/events'
import type { Story } from '../types/story'

function videoStories(count: number): Story[] {
  return Array.from({ length: count }, (_, index) => ({
    type: 'video',
    id: `s${index}`,
    title: `Story ${index}`,
    category: 'news',
    video: `v${index}.mp4`,
  }))
}

function buildController(adEvery: number) {
  const stories = videoStories(8)
  const controller = new PlayerController({
    config: resolveConfig({ feed: { stories }, ads: { every: adEvery, durationMs: 1000 } }),
    store: new MemoryStateStore(),
    events: new EventBus<FlipReelEventMap>(),
  })
  controller.setStories(stories)
  return controller
}

describe('PlayerController ad cadence', () => {
  it('never injects ad sections into the feed', () => {
    const controller = buildController(2)
    controller.open('s0')
    const snap = controller.snapshot()
    expect(snap.stories).toHaveLength(8)
    expect(snap.stories.every((story) => story.id.startsWith('s'))).toBe(true)
  })

  it('counts the opening view so the ad occupies the Nth viewed slot', () => {
    const controller = buildController(4)
    controller.open('s0')

    controller.requestIndex(1)
    controller.requestIndex(2)
    expect(controller.snapshot().ad.active).toBe(false)

    controller.requestIndex(3)
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().activeIndex).toBe(3)
  })

  it('starts the cadence from the opening story regardless of start position', () => {
    const controller = buildController(4)
    controller.open('s4')

    controller.requestIndex(5)
    controller.requestIndex(6)
    expect(controller.snapshot().ad.active).toBe(false)

    controller.requestIndex(7)
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().activeIndex).toBe(7)
  })

  it('surfaces the ad on top of the landed move without advancing past it', () => {
    const controller = buildController(2)
    controller.open('s0')

    controller.requestIndex(1)
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().activeIndex).toBe(1)

    controller.tick(1000)
    expect(controller.snapshot().ad.active).toBe(false)
    expect(controller.snapshot().activeIndex).toBe(1)
  })

  it('restarts the cycle after a resolved ad', () => {
    const controller = buildController(4)
    controller.open('s0')

    controller.requestIndex(1)
    controller.requestIndex(2)
    controller.requestIndex(3)
    expect(controller.snapshot().ad.active).toBe(true)
    controller.tick(1000)

    controller.requestIndex(4)
    controller.requestIndex(5)
    expect(controller.snapshot().ad.active).toBe(false)

    controller.requestIndex(6)
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().activeIndex).toBe(6)
  })

  it('defers a due ad past backward moves and raises it on the next forward move', () => {
    const controller = buildController(3)
    controller.open('s2')

    controller.requestIndex(1)
    controller.requestIndex(0)
    expect(controller.snapshot().ad.active).toBe(false)

    controller.requestIndex(1)
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().activeIndex).toBe(1)
  })

  it('counts a category switch as a viewed slot', () => {
    const controller = buildController(2)
    controller.open('s0')

    controller.setCategory('news')
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().activeIndex).toBe(0)
  })

  it('keeps the first ad non-skippable then opens the gate', () => {
    const controller = buildController(2)
    controller.open('s0')

    controller.requestIndex(1)
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().ad.skippable).toBe(false)
    controller.tick(1000)

    controller.requestIndex(2)
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().ad.skippable).toBe(true)
  })

  it('dismisses the ad break on no-fill and keeps the landed move', () => {
    const controller = buildController(2)
    controller.open('s0')

    controller.requestIndex(1)
    expect(controller.snapshot().ad.active).toBe(true)
    expect(controller.snapshot().activeIndex).toBe(1)

    controller.onAdNoFill()
    expect(controller.snapshot().ad.active).toBe(false)
    expect(controller.snapshot().activeIndex).toBe(1)
  })

  it('surfaces the ad on top of a landed swipe without deferring', () => {
    const controller = buildController(2)
    controller.open('s0')

    controller.notifyLanded(1)
    expect(controller.snapshot().activeIndex).toBe(1)
    expect(controller.snapshot().ad.active).toBe(true)

    controller.tick(1000)
    expect(controller.snapshot().ad.active).toBe(false)
    expect(controller.snapshot().activeIndex).toBe(1)
  })
})

describe('PlayerController read more', () => {
  function buildWithBus() {
    const stories = videoStories(2)
    const events = new EventBus<FlipReelEventMap>()
    const controller = new PlayerController({
      config: resolveConfig({ feed: { stories } }),
      store: new MemoryStateStore(),
      events,
    })
    controller.setStories(stories)
    controller.open('s0')
    return { controller, events }
  }

  it('emits the readmore event with the story link and allows by default', () => {
    const { controller, events } = buildWithBus()
    let payload: FlipReelEventMap['flip-reel:readmore'] | undefined
    events.on('flip-reel:readmore', (detail) => {
      payload = detail
    })
    expect(controller.readMore()).toBe(true)
    expect(payload).toEqual({ storyId: 's0', link: undefined })
  })

  it('reports cancellation when a listener prevents the default', () => {
    const { controller, events } = buildWithBus()
    events.on('flip-reel:readmore', () => false)
    expect(controller.readMore()).toBe(false)
  })
})
