import { describe, expect, it } from 'vitest'
import { PlaylistModel } from './playlist-model'
import type { Story } from '../types/story'

function stories(count: number): Story[] {
  return Array.from({ length: count }, (_, index) => ({
    type: 'video',
    id: `s${index}`,
    title: `Story ${index}`,
    category: 'news',
    video: `v${index}.mp4`,
  }))
}

function buildModel(count: number, loop = false): PlaylistModel {
  const model = new PlaylistModel(loop)
  model.setStories(stories(count))
  return model
}

describe('PlaylistModel', () => {
  it('starts at the first story', () => {
    const model = buildModel(3)
    expect(model.index).toBe(0)
    expect(model.current?.id).toBe('s0')
    expect(model.length).toBe(3)
  })

  it('walks forward and stops at the end without loop', () => {
    const model = buildModel(2)
    expect(model.next()).toBe(true)
    expect(model.index).toBe(1)
    expect(model.canNext).toBe(false)
    expect(model.next()).toBe(false)
    expect(model.index).toBe(1)
  })

  it('walks backward and stops at the start without loop', () => {
    const model = buildModel(2)
    expect(model.canPrev).toBe(false)
    expect(model.prev()).toBe(false)
    model.next()
    expect(model.prev()).toBe(true)
    expect(model.index).toBe(0)
  })

  it('wraps around in both directions with loop', () => {
    const model = buildModel(2, true)
    expect(model.prev()).toBe(true)
    expect(model.index).toBe(1)
    expect(model.next()).toBe(true)
    expect(model.index).toBe(0)
    expect(model.canPrev).toBe(true)
    expect(model.canNext).toBe(true)
  })

  it('focuses a story by id and falls back to the first', () => {
    const model = buildModel(3)
    model.focusById('s2')
    expect(model.index).toBe(2)
    model.focusById('missing')
    expect(model.index).toBe(0)
  })

  it('resets the cursor when stories change', () => {
    const model = buildModel(3)
    model.next()
    model.setStories(stories(2))
    expect(model.index).toBe(0)
  })
})
