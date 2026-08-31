/** Thrown when {@link FlipReelOptions} are invalid, e.g. the feed source is missing. */
export class FlipReelConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FlipReelConfigError'
  }
}

/** Thrown when the feed cannot be fetched or contains no valid stories. */
export class FeedLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FeedLoadError'
  }
}
