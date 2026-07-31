import { LitElement, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { LeasePriority, type FlipReelOptions, type PlayerState } from '@flipatic/flip-reel-core'
import { WidgetController } from '../context/widget-controller'
import { readOptions } from '../context/attribute-options'
import { VideoLeaseController } from '../controllers/video-lease-controller'
import { Ticker } from '../controllers/ticker'
import { ReelScrollDriver } from '../controllers/reel-scroll-driver'
import { WheelInputRouter } from '../controllers/wheel-input-router'
import { playerStyles } from './player-styles'
import { tokens } from '../styles/tokens'
import { controlButton } from '../styles/shared'
import { renderStage, type PlayerHandlers } from './player-view'
import './category-menu'
import { FlipReelProgressBar } from './progress-bar'
import './blurred-background'
import './ad-slide'

const SETTLE_DELAY_MS = 110
const AUTO_ADVANCE_SCROLL_GUARD_MS = 200

@customElement('flip-reel-player')
export class FlipReelPlayer extends LitElement {
  @property({ attribute: false }) widget?: WidgetController
  @property({ attribute: false }) options?: FlipReelOptions
  @property() start?: string

  @state() private snapshot?: PlayerState
  @state() private burst?: { storyId: string; seq: number }

  static styles = [tokens, controlButton, playerStyles]

  private readonly ticker = new Ticker((delta) => {
    this.controller?.tick(delta)
    this.updateVideoProgress()
  })
  private videoLease?: VideoLeaseController
  private unsubscribe?: () => void
  private own?: WidgetController
  private scrollBound = false
  private wheelBound = false
  private needsInitialScroll = false
  private syncedIndex = -1
  private syncedCategory = ''
  private pendingRewind = false
  private wasAdActive = false
  private lastUserScrollAt = Number.NEGATIVE_INFINITY
  private settleTimer = 0
  private mediaTapTimer = 0
  private burstSeq = 0
  private burstTimer = 0
  private readonly wheelRouter = new WheelInputRouter()
  private readonly scrollDriver = new ReelScrollDriver({
    scroller: () => this.renderRoot.querySelector<HTMLElement>('.scroller'),
    reels: () => Array.from(this.renderRoot.querySelectorAll<HTMLElement>('.reel')),
  })

  connectedCallback(): void {
    super.connectedCallback()
    if (this.widget) this.attach(this.widget)
    else void this.bootstrap()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.unsubscribe?.()
    this.ticker.stop()
    window.clearTimeout(this.settleTimer)
    window.clearTimeout(this.mediaTapTimer)
    window.clearTimeout(this.burstTimer)
    this.scrollDriver.destroy()
    this.own?.destroy()
  }

  willUpdate(changed: PropertyValues): void {
    if (changed.has('widget') && this.widget) this.attach(this.widget)
  }

  updated(): void {
    this.syncDialog()
    this.bindScroll()
    this.bindWheel()
    this.syncVideos()
    this.reconcileAdEdge()
    this.syncScrollPosition()
    this.scrollDriver.updateFade()
  }

  private get controller() {
    return (this.widget ?? this.own)?.player
  }

  private async bootstrap(): Promise<void> {
    const options = this.options ?? readOptions(this)
    if (!options) return
    this.own = new WidgetController(options, this)
    this.attach(this.own)
    await this.own.load()
    if (this.start) this.own.player.open(this.start)
  }

  private attach(widget: WidgetController): void {
    this.unsubscribe?.()
    this.videoLease = new VideoLeaseController(this, widget.scheduler, () => {
      this.activeVideo()?.pause()
    })
    this.unsubscribe = widget.player.subscribe((state) => {
      const prev = this.snapshot
      const opened = state.open && !prev?.open
      const activated =
        prev !== undefined &&
        (state.activeIndex !== prev.activeIndex || state.categoryId !== prev.categoryId)
      this.snapshot = state
      if (opened) this.needsInitialScroll = true
      if (opened || activated) this.pendingRewind = true
      this.requestUpdate()
    })
  }

  private get scroller() {
    return this.renderRoot.querySelector<HTMLElement>('.scroller')
  }

  private activeVideo(): HTMLVideoElement | undefined {
    const index = this.snapshot?.activeIndex
    return (
      this.renderRoot.querySelector<HTMLVideoElement>(`video.media[data-index="${index}"]`) ??
      undefined
    )
  }

  private activeProgressBar(): FlipReelProgressBar | null {
    const index = this.snapshot?.activeIndex
    if (index === undefined) return null
    const reel = this.renderRoot.querySelector(`.reel[data-index="${index}"]`)
    return reel?.querySelector<FlipReelProgressBar>('flip-reel-progress-bar') ?? null
  }

  private updateVideoProgress(): void {
    const snap = this.snapshot
    if (!snap || snap.paused || snap.ad.active) return
    const video = this.activeVideo()
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0 || video.paused) return
    const bar = this.activeProgressBar()
    if (bar) bar.value = Math.min(1, video.currentTime / video.duration)
  }

  private syncDialog(): void {
    const dialog = this.renderRoot.querySelector('dialog')
    if (!dialog || !this.snapshot) return
    if (this.snapshot.open && !dialog.open) {
      dialog.showModal()
      this.ticker.start()
    } else if (!this.snapshot.open && dialog.open) {
      dialog.close()
      this.ticker.stop()
      this.videoLease?.release()
      this.scrollDriver.cancel()
    }
  }

  private bindScroll(): void {
    const scroller = this.scroller
    if (!scroller || this.scrollBound) return
    scroller.addEventListener('scroll', this.onScroll, { passive: true })
    this.scrollBound = true
  }

  private bindWheel(): void {
    const scroller = this.scroller
    if (!scroller || this.wheelBound) return
    scroller.addEventListener('wheel', this.onWheel, { passive: false })
    this.wheelBound = true
  }

  private readonly onScroll = (): void => {
    if (this.scrollDriver.isAnimating) return
    this.lastUserScrollAt = performance.now()
    this.scrollDriver.updateFade()
    this.scheduleSettle()
  }

  private readonly onWheel = (event: WheelEvent): void => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    const route = this.wheelRouter.route(event.deltaY, event.deltaMode, performance.now())
    const snap = this.snapshot
    if (!snap) return
    if (snap.ad.active) {
      event.preventDefault()
      this.wheelRouter.blockBurst()
      return
    }
    if (route === 'native') {
      if (this.scrollDriver.isAnimating) this.scrollDriver.cancel()
      return
    }
    event.preventDefault()
    if (route === 'step') this.stepBy(event.deltaY > 0 ? 1 : -1)
  }

  private stepBy(direction: 1 | -1): void {
    const snap = this.snapshot
    if (!snap || snap.ad.active) return
    const from = this.scrollDriver.isAnimating
      ? this.scrollDriver.animationTarget
      : this.scrollDriver.nearestIndex(snap.activeIndex)
    const target = from + direction
    if (target < 0 || target >= snap.stories.length) return
    this.scrollDriver.animateTo(target, () => this.controller?.notifyLanded(target))
  }

  private scheduleSettle(): void {
    window.clearTimeout(this.settleTimer)
    this.settleTimer = window.setTimeout(() => this.onSettle(), SETTLE_DELAY_MS)
  }

  private onSettle(): void {
    const snap = this.snapshot
    if (!snap || snap.ad.active || this.scrollDriver.isAnimating) return
    const index = this.scrollDriver.nearestIndex(snap.activeIndex)
    if (index !== snap.activeIndex) this.controller?.notifyLanded(index)
  }

  private reconcileAdEdge(): void {
    const adActive = this.snapshot?.ad.active ?? false
    const resolved = this.wasAdActive && !adActive
    this.wasAdActive = adActive
    if (!resolved) return
    const snap = this.snapshot
    if (!snap || this.scrollDriver.isAnimating || this.scrollDriver.atIndex(snap.activeIndex)) {
      return
    }
    this.scrollDriver.jumpTo(snap.activeIndex)
    this.syncedIndex = snap.activeIndex
  }

  private syncVideos(): void {
    const snap = this.snapshot
    if (!snap) return
    if (this.pendingRewind) {
      this.pendingRewind = false
      const active = this.activeVideo()
      if (active && active.currentTime > 0) active.currentTime = 0
    }
    for (const video of this.renderRoot.querySelectorAll<HTMLVideoElement>('video.media')) {
      const index = Number(video.dataset.index)
      video.muted = snap.muted
      const playable = index === snap.activeIndex && snap.open && !snap.paused && !snap.ad.active
      if (playable) {
        this.videoLease?.acquire(LeasePriority.PLAYER_ACTIVE)
        if (video.paused) video.play().catch(() => this.controller?.setAutoplayBlocked(true))
      } else if (!video.paused) {
        video.pause()
      }
    }
  }

  private syncScrollPosition(): void {
    const snap = this.snapshot
    const scroller = this.scroller
    if (!snap || !scroller) return
    const categoryChanged = snap.categoryId !== this.syncedCategory
    if (this.needsInitialScroll || categoryChanged) {
      this.needsInitialScroll = false
      this.syncedCategory = snap.categoryId
      this.syncedIndex = snap.activeIndex
      this.scrollDriver.jumpTo(snap.activeIndex)
      return
    }
    if (snap.activeIndex === this.syncedIndex) return
    this.syncedIndex = snap.activeIndex
    if (this.scrollDriver.atIndex(snap.activeIndex)) return
    if (this.scrollDriver.isAnimating && this.scrollDriver.animationTarget === snap.activeIndex) {
      return
    }
    if (snap.ad.active) this.scrollDriver.jumpTo(snap.activeIndex)
    else this.scrollDriver.animateTo(snap.activeIndex)
  }

  private onVideoLoaded(event: Event): void {
    const video = event.target as HTMLVideoElement
    const snap = this.snapshot
    if (
      !snap ||
      Number(video.dataset.index) !== snap.activeIndex ||
      snap.paused ||
      snap.ad.active
    ) {
      return
    }
    this.videoLease?.acquire(LeasePriority.PLAYER_ACTIVE)
    video.muted = snap.muted
    video.play().then(
      () => this.controller?.setAutoplayBlocked(false),
      () => this.controller?.setAutoplayBlocked(true),
    )
  }

  private onVideoTime(event: Event): void {
    const video = event.target as HTMLVideoElement
    const snap = this.snapshot
    if (!snap || Number(video.dataset.index) !== snap.activeIndex) return
    if (Number.isFinite(video.duration) && video.duration > 0) {
      this.controller?.reportVideoProgress(video.currentTime * 1000, video.duration * 1000)
    }
  }

  private onSeek(fraction: number): void {
    const snap = this.snapshot
    if (!snap || snap.ad.active) return
    const video = this.activeVideo()
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return
    const time = Math.max(0, Math.min(1, fraction)) * video.duration
    video.currentTime = time
    this.controller?.reportVideoProgress(time * 1000, video.duration * 1000)
  }

  private onVideoEnded(event: Event): void {
    const video = event.target as HTMLVideoElement
    const snap = this.snapshot
    if (!snap || Number(video.dataset.index) !== snap.activeIndex) return
    if (this.scrollDriver.isAnimating) return
    if (performance.now() - this.lastUserScrollAt < AUTO_ADVANCE_SCROLL_GUARD_MS) return
    this.stepBy(1)
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const snap = this.snapshot
    if (!snap || snap.ad.active) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      this.stepBy(1)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      this.stepBy(-1)
    } else if (event.key === ' ') {
      event.preventDefault()
      this.controller?.togglePause()
    }
  }

  private burstLike(storyId: string): void {
    this.burstSeq += 1
    this.burst = { storyId, seq: this.burstSeq }
    window.clearTimeout(this.burstTimer)
    this.burstTimer = window.setTimeout(() => (this.burst = undefined), 720)
  }

  private likeFromTap(storyId: string): void {
    const wasLiked = this.snapshot?.likedIds.has(storyId) ?? false
    this.controller?.toggleLike(storyId)
    if (!wasLiked) this.burstLike(storyId)
  }

  private readonly onMediaTap = (storyId: string, _event: Event): void => {
    if (!this.snapshot || this.snapshot.ad.active) return
    const likeEnabled = (this.widget ?? this.own)?.config.interactions.like ?? false
    if (!likeEnabled) {
      this.controller?.togglePause()
      return
    }
    if (this.mediaTapTimer) {
      window.clearTimeout(this.mediaTapTimer)
      this.mediaTapTimer = 0
      this.likeFromTap(storyId)
      return
    }
    this.mediaTapTimer = window.setTimeout(() => {
      this.mediaTapTimer = 0
      this.controller?.togglePause()
    }, 280)
  }

  private readonly handlers: PlayerHandlers = {
    close: () => this.controller?.close(),
    setCategory: (id) => this.controller?.setCategory(id),
    prev: () => this.stepBy(-1),
    next: () => this.stepBy(1),
    togglePause: () => this.controller?.togglePause(),
    toggleMute: () => this.controller?.toggleMuted(),
    toggleLike: (storyId) => this.likeFromTap(storyId),
    onMediaTap: (storyId, event) => this.onMediaTap(storyId, event),
    share: (storyId) => this.controller?.share(storyId),
    readMore: () => this.controller?.readMore(),
    onVideoLoaded: (event) => this.onVideoLoaded(event),
    onVideoTime: (event) => this.onVideoTime(event),
    onVideoEnded: (event) => this.onVideoEnded(event),
    onSeek: (fraction) => this.onSeek(fraction),
    onAdImpression: () => this.controller?.onAdImpression(),
    onAdNoFill: () => this.controller?.onAdNoFill(),
    onAdSkip: () => this.controller?.requestAdSkip(),
  }

  render() {
    const snap = this.snapshot
    const widget = this.widget ?? this.own
    if (!snap || !widget) return nothing
    const activeStory = snap.stories[snap.activeIndex] ?? null
    const activePoster = activeStory
      ? activeStory.type === 'video'
        ? activeStory.poster
        : activeStory.image
      : undefined
    return html`<dialog
      @cancel="${(event: Event) => {
        event.preventDefault()
        this.controller?.close()
      }}"
      @close="${() => {
        if (this.snapshot?.open) this.controller?.close()
      }}"
      @keydown="${this.onKeyDown}"
    >
      ${renderStage({
        state: snap,
        messages: widget.messages,
        config: widget.config,
        categories: widget.categories,
        brandName: widget.config.brand,
        brandLogo: widget.config.brandLogo,
        adapter: widget.config.adapters.ad,
        activeStory,
        activePoster,
        burst: this.burst,
        handlers: this.handlers,
      })}
    </dialog>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'flip-reel-player': FlipReelPlayer
  }
}
