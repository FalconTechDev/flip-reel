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

  it('keeps a steady slow trackpad drag native', () => {
    const samples = Array.from({ length: 5 }, (_, index) => ({ delta: 18, at: index * 16 }))
    expect(routesFor(new WheelInputRouter(), samples)).toEqual([
      'native',
      'native',
      'native',
      'native',
      'native',
    ])
  })

  it('routes discrete notches to steps at slow cadence', () => {
    const samples: WheelSample[] = [
      { delta: 100, at: 0 },
      { delta: 100, at: 300 },
      { delta: 100, at: 600 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['step', 'step', 'step'])
  })

  it('routes every notch of a fast spin as a wheel step', () => {
    const samples = Array.from({ length: 4 }, (_, index) => ({ delta: 100, at: index * 50 }))
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['step', 'step', 'step', 'step'])
  })

  it('keeps smoothing sub-deltas inside a stepped burst as steps', () => {
    const samples: WheelSample[] = [
      { delta: 100, at: 0 },
      { delta: 25, at: 30 },
      { delta: 25, at: 60 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['step', 'step', 'step'])
  })

  it('classifies slow mid-delta notching across burst gaps', () => {
    const samples: WheelSample[] = [
      { delta: 45, at: 0 },
      { delta: 45, at: 300 },
      { delta: 45, at: 600 },
      { delta: 45, at: 900 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['native', 'native', 'step', 'step'])
  })

  it('steps a mid-delta wheel spinning at human cadence', () => {
    const samples: WheelSample[] = [
      { delta: 45, at: 0 },
      { delta: 45, at: 120 },
      { delta: 45, at: 240 },
      { delta: 45, at: 360 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['native', 'native', 'step', 'step'])
  })

  it('steps a high-resolution wheel notch after a short probe', () => {
    const samples: WheelSample[] = [
      { delta: 24, at: 0 },
      { delta: 24, at: 2 },
      { delta: 24, at: 4 },
      { delta: 24, at: 6 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['native', 'native', 'step', 'step'])
  })

  it('keeps stepping follow-up notches while wheel mode is sticky', () => {
    const router = new WheelInputRouter()
    routesFor(router, [
      { delta: 24, at: 0 },
      { delta: 24, at: 2 },
      { delta: 24, at: 4 },
    ])
    const followUp: WheelSample[] = [
      { delta: 26, at: 300 },
      { delta: 26, at: 302 },
    ]
    expect(routesFor(router, followUp)).toEqual(['step', 'step'])
  })

  it('classifies accelerated small clicks at slow cadence', () => {
    const samples: WheelSample[] = [
      { delta: 6, at: 0 },
      { delta: 7, at: 350 },
      { delta: 5, at: 700 },
      { delta: 8, at: 1050 },
    ]
    expect(routesFor(new WheelInputRouter(), samples)).toEqual(['native', 'native', 'step', 'step'])
  })

  it('steps a lone small click during wheel afterglow', () => {
    const router = new WheelInputRouter()
    expect(router.route(100, 0, 0)).toBe('step')
    expect(router.route(6, 0, 3000)).toBe('step')
  })

  it('forgets wheel mode after a long idle gap', () => {
    const router = new WheelInputRouter()
    expect(router.route(100, 0, 0)).toBe('step')
    expect(router.route(20, 0, 8000)).toBe('native')
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
})
