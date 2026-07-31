export interface MediaRendition {
  src: string
  type?: string
  width?: number
  height?: number
}

export interface StoryInteractions {
  likeable?: boolean
  shareable?: boolean
  initiallyLiked?: boolean
}

interface StoryBase {
  id: string
  title: string
  category: string
  brand?: string
  brandLogo?: string
  date?: string
  poster?: string
  link?: string
  readMoreLabel?: string
  interactions?: StoryInteractions
}

export interface VideoStory extends StoryBase {
  type: 'video'
  video: string
  renditions?: MediaRendition[]
  preview?: string
  durationMs?: number
}

export interface ImageStory extends StoryBase {
  type: 'image'
  image: string
  durationMs?: number
}

export type Story = VideoStory | ImageStory

export interface Category {
  id: string
  label: string
}

export interface Feed {
  stories: Story[]
  categories?: Category[]
}

export function isVideoStory(story: Story): story is VideoStory {
  return story.type === 'video'
}

export function isImageStory(story: Story): story is ImageStory {
  return story.type === 'image'
}
