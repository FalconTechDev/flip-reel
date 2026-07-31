import type { Feed, Story } from './story'

export type FeedSource = string | Feed | (() => Feed | Promise<Feed>)

export type AdFormat = 'vertical-video' | 'display'

export interface AdSlotContext {
  index: number
  container: HTMLElement
  format: AdFormat
  locale: string
  consent?: unknown
}

export interface AdHandle {
  durationMs?: number
  skippableAfterMs?: number
  refresh?: () => void
  onImpression?: () => void
  destroy: () => void
}

export interface AdAdapter {
  request(context: AdSlotContext): Promise<AdHandle | null>
}

export interface FeedAdapter {
  load(source: FeedSource): Promise<Feed>
}

export interface StateStore {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T): void
  remove(key: string): void
}

export interface StorySelection {
  story: Story
  index: number
}
