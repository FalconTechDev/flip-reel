import { FeedLoadError } from '../config/config-errors'
import type { Category, Feed, Story } from '../types/story'

export const ALL_CATEGORY_ID = 'all'

function isStory(value: unknown): value is Story {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  const hasIdentity = typeof candidate.id === 'string' && typeof candidate.title === 'string'
  const hasMedia =
    (candidate.type === 'video' && typeof candidate.video === 'string') ||
    (candidate.type === 'image' && typeof candidate.image === 'string')
  return hasIdentity && hasMedia
}

function deriveCategories(stories: Story[], allLabel: string): Category[] {
  const seen = new Map<string, Category>()
  for (const story of stories) {
    if (!seen.has(story.category)) {
      seen.set(story.category, { id: story.category, label: story.category })
    }
  }
  return [{ id: ALL_CATEGORY_ID, label: allLabel }, ...seen.values()]
}

export function normalizeFeed(raw: unknown, allLabel: string, override?: Category[]): Feed {
  const source = (Array.isArray(raw) ? { stories: raw } : raw) as Partial<Feed> | null
  const rawStories = source?.stories
  if (!Array.isArray(rawStories)) {
    throw new FeedLoadError('Feed must contain a "stories" array')
  }

  const stories = rawStories.filter(isStory)
  if (stories.length === 0) {
    throw new FeedLoadError('Feed does not contain any valid stories')
  }

  const categories = override ?? source?.categories ?? deriveCategories(stories, allLabel)
  const withAll = categories.some((category) => category.id === ALL_CATEGORY_ID)
    ? categories
    : [{ id: ALL_CATEGORY_ID, label: allLabel }, ...categories]

  return { stories, categories: withAll }
}

export function filterByCategory(stories: Story[], categoryId: string): Story[] {
  if (categoryId === ALL_CATEGORY_ID) return stories
  return stories.filter((story) => story.category === categoryId)
}
