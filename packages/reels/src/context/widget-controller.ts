import {
  DefaultFeedAdapter,
  EventBus,
  MemoryStateStore,
  PlayerController,
  createInstanceId,
  filterByCategory,
  getRuntime,
  resolveConfig,
  type Category,
  type FeedAdapter,
  type FlipReelEventMap,
  type FlipReelEventName,
  type FlipReelOptions,
  type MediaScheduler,
  type ResolvedConfig,
  type StateStore,
  type Story,
} from '@flipatic/flip-reel-core'
import { getMessages, type Messages } from '../i18n/i18n'

const FORWARDED_EVENTS: FlipReelEventName[] = [
  'flip-reel:ready',
  'flip-reel:open',
  'flip-reel:close',
  'flip-reel:view',
  'flip-reel:play',
  'flip-reel:pause',
  'flip-reel:like',
  'flip-reel:share',
  'flip-reel:readmore',
  'flip-reel:error',
  'flip-reel:ad:requested',
  'flip-reel:ad:impression',
  'flip-reel:ad:completed',
  'flip-reel:ad:skipped',
  'flip-reel:ad:empty',
]

export class WidgetController {
  readonly config: ResolvedConfig
  readonly events = new EventBus<FlipReelEventMap>()
  readonly store: StateStore
  readonly scheduler: MediaScheduler
  readonly messages: Messages
  readonly player: PlayerController
  readonly instanceId = createInstanceId()

  stories: Story[] = []
  categories: Category[] = []
  ready = false
  error: string | null = null

  private readonly feedAdapter: FeedAdapter
  private readonly unbind: Array<() => void> = []

  constructor(
    options: FlipReelOptions,
    private readonly host: HTMLElement,
  ) {
    this.config = resolveConfig(options)
    this.messages = getMessages(this.config.locale)
    this.store = this.config.adapters.state ?? new MemoryStateStore()

    const runtime = getRuntime()
    this.scheduler = runtime.scheduler
    runtime.instances.add(this.instanceId)

    this.feedAdapter =
      this.config.adapters.feed ??
      new DefaultFeedAdapter({
        allLabel: this.messages.categoryAll,
        categories: this.config.categories ?? undefined,
      })

    this.player = new PlayerController({
      config: this.config,
      store: this.store,
      events: this.events,
    })

    this.forwardDomEvents()
  }

  async load(): Promise<void> {
    try {
      const feed = await this.feedAdapter.load(this.config.feed)
      this.stories = feed.stories
      this.categories = feed.categories ?? []
      this.player.setStories(this.stories)
      this.ready = true
      this.events.emit('flip-reel:ready', { instanceId: this.instanceId })
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load feed'
      this.events.emit('flip-reel:error', { scope: 'feed', message: this.error })
    }
  }

  storiesFor(categoryId: string): Story[] {
    return filterByCategory(this.stories, categoryId)
  }

  destroy(): void {
    for (const off of this.unbind) off()
    this.player.destroy()
    this.events.clear()
    getRuntime().instances.delete(this.instanceId)
  }

  private forwardDomEvents(): void {
    for (const name of FORWARDED_EVENTS) {
      const off = this.events.on(name, (detail) => {
        this.host.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }))
      })
      this.unbind.push(off)
    }
  }
}
