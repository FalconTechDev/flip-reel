import type { Story } from '../types/story'

/** Ad-break portion of the {@link PlayerState} snapshot. */
export interface AdState {
  active: boolean
  skippable: boolean
  blocking: boolean
  index: number
  remainingMs: number
  durationMs: number
}

/** Immutable snapshot of the player, delivered to every subscriber on change. */
export interface PlayerState {
  open: boolean
  categoryId: string
  stories: Story[]
  activeIndex: number
  muted: boolean
  paused: boolean
  autoplayBlocked: boolean
  storyProgress: number
  likedIds: ReadonlySet<string>
  ad: AdState
}
