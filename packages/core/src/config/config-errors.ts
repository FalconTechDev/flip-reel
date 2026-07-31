export class FlipReelConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FlipReelConfigError'
  }
}

export class FeedLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FeedLoadError'
  }
}
