/** A single media file variant of a story video, used for resolution switching. */
export interface MediaRendition {
  /** URL of the media file. */
  src: string
  /** MIME type, e.g. `video/mp4`. */
  type?: string
  /** Intrinsic width in pixels. */
  width?: number
  /** Intrinsic height in pixels. */
  height?: number
}

/** Per-story overrides for the interaction buttons shown in the player. */
export interface StoryInteractions {
  /** Whether the like button is shown for this story. */
  likeable?: boolean
  /** Whether the share button is shown for this story. */
  shareable?: boolean
  /** Whether the story starts in the liked state. */
  initiallyLiked?: boolean
}

interface StoryBase {
  /** Unique story identifier, reported in every widget event. */
  id: string
  /** Headline rendered in the player caption and used as the image alt text. */
  title: string
  /** Category id the story belongs to; feeds the category menu and filtering. */
  category: string
  /** Byline brand name shown under the title. */
  brand?: string
  /** URL of a small brand logo for the byline. */
  brandLogo?: string
  /** Display date for the byline, rendered as given. */
  date?: string
  /** Poster image URL shown before the video loads and in the rail card. */
  poster?: string
  /**
   * Target URL of the "read more" call to action. Only `http:`/`https:` and
   * relative URLs survive feed normalization.
   */
  link?: string
  /** Custom label for the "read more" call to action, overriding the locale default. */
  readMoreLabel?: string
  /** Per-story interaction overrides. */
  interactions?: StoryInteractions
}

/** A story backed by a video file. */
export interface VideoStory extends StoryBase {
  type: 'video'
  /** URL of the video file. */
  video: string
  /** Alternative renditions of the video. */
  renditions?: MediaRendition[]
  /** URL of a short muted preview clip played on rail-card hover. */
  preview?: string
  /** Video duration in milliseconds, used before metadata loads. */
  durationMs?: number
}

/** A story backed by a still image. */
export interface ImageStory extends StoryBase {
  type: 'image'
  /** URL of the image. */
  image: string
  /** How long the image stays on screen in milliseconds. */
  durationMs?: number
}

/** Any story the widget can play. */
export type Story = VideoStory | ImageStory

/** A category entry for the player's category menu. */
export interface Category {
  /** Stable identifier matched against {@link StoryBase.category}. */
  id: string
  /** Human-readable label shown in the menu. */
  label: string
}

/** The normalized feed consumed by the widget. */
export interface Feed {
  stories: Story[]
  /** Explicit category list; derived from stories when omitted. */
  categories?: Category[]
}

/** Narrows a {@link Story} to a {@link VideoStory}. */
export function isVideoStory(story: Story): story is VideoStory {
  return story.type === 'video'
}

/** Narrows a {@link Story} to an {@link ImageStory}. */
export function isImageStory(story: Story): story is ImageStory {
  return story.type === 'image'
}
