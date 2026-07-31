import type { Story } from '../types/story'

export class PlaylistModel {
  private stories: Story[] = []
  private cursor = 0

  constructor(private readonly loop: boolean) {}

  setStories(stories: Story[]): void {
    this.stories = stories
    this.cursor = 0
  }

  get length(): number {
    return this.stories.length
  }

  get index(): number {
    return this.cursor
  }

  get current(): Story | null {
    return this.stories[this.cursor] ?? null
  }

  focusById(id: string): void {
    const found = this.stories.findIndex((story) => story.id === id)
    this.cursor = found >= 0 ? found : 0
  }

  get canPrev(): boolean {
    return this.loop ? this.length > 1 : this.cursor > 0
  }

  get canNext(): boolean {
    return this.loop ? this.length > 1 : this.cursor < this.length - 1
  }

  next(): boolean {
    if (this.cursor < this.length - 1) {
      this.cursor += 1
      return true
    }
    if (this.loop && this.length > 0) {
      this.cursor = 0
      return true
    }
    return false
  }

  prev(): boolean {
    if (this.cursor > 0) {
      this.cursor -= 1
      return true
    }
    if (this.loop && this.length > 0) {
      this.cursor = this.length - 1
      return true
    }
    return false
  }
}
