import { describe, expect, it } from 'vitest'
import { WheelInputRouter, type WheelRoute } from './wheel-input-router'

interface WheelSample {
  delta: number
  at: number
  mode?: number
}

function routesFor(router: WheelInputRouter, samples: WheelSample[]): WheelRoute[] {
  return samples.map((sample) => router.route(sample.delta, sample.mode ?? 0, sample.at))
}

function trackpadFlick(start: number): WheelSample[] {
  const deltas = [4, 12, 40, 90, 84, 70, 55, 42, 30, 21, 14, 9, 6, 4]
  return deltas.map((delta, index) => ({ delta, at: start + index * 45 }))
}

describe('WheelInputRouter', () => {
  it('routes a whole trackpad flick to native scrolling', () => {
    const routes = routesFor(new WheelInputRouter(), trackpadFlick(0))
    expect(routes.every((route) => route === 'native')).toBe(true)
  })

  it('keeps a burst native even when mid-burst deltas grow large', () => {
    const samples: WheelSample[] = [
      { delta: 10, at: 0 },
      { delta: 120, at: 40 },
      { delta: 90, at: 80 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['native', 'native', 'native'])
  })

  it('routes discrete notches to steps at slow cadence', () => {
    const samples: WheelSample[] = [
      { delta: 100, at: 0 },
      { delta: 100, at: 300 },
      { delta: 100, at: 600 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['step', 'step', 'step'])
  })

  it('routes a fast notch spin to one step per notch', () => {
    const samples = Array.from({ length: 4 }, (_, index) => ({ delta: 100, at: index * 50 }))
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['step', 'step', 'step', 'step'])
  })

  it('swallows smoothing sub-deltas inside a stepped burst', () => {
    const samples: WheelSample[] = [
      { delta: 100, at: 0 },
      { delta: 25, at: 30 },
      { delta: 25, at: 60 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['step', 'swallow', 'swallow'])
  })

  it('treats line-mode deltas as steps regardless of magnitude', () => {
    const samples: WheelSample[] = [
      { delta: 3, at: 0, mode: 1 },
      { delta: 3, at: 300, mode: 1 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['step', 'step'])
  })

  it('blocks the rest of a burst after blockBurst until a quiet gap', () => {
    const router = new WheelInputRouter()
    expect(router.route(30, 0, 0)).toBe('native')
    router.blockBurst()
    expect(router.route(28, 0, 40)).toBe('blocked')
    expect(router.route(20, 0, 80)).toBe('blocked')
    expect(router.route(30, 0, 400)).toBe('native')
  })

  it('re-classifies after a quiet gap between input kinds', () => {
    const router = new WheelInputRouter()
    expect(router.route(10, 0, 0)).toBe('native')
    expect(router.route(100, 0, 400)).toBe('step')
    expect(router.route(10, 0, 800)).toBe('native')
  })
})
