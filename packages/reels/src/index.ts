import './elements/reels-element'
import './elements/rail-element'
import './elements/player-element'
import { FlipReelReels } from './elements/reels-element'
import type { FlipReelOptions } from '@flipatic/flip-reel-core'

export { FlipReelReels } from './elements/reels-element'
export { FlipReelRail } from './elements/rail-element'
export { FlipReelPlayer } from './elements/player-element'
export { FlipReelRailCard } from './elements/rail-card'
export { FlipReelCategoryMenu } from './elements/category-menu'
export { FlipReelProgressBar } from './elements/progress-bar'
export { FlipReelAdSlide } from './elements/ad-slide'
export { FlipReelBlurredBackground } from './elements/blurred-background'
export { WidgetController } from './context/widget-controller'
export { getMessages, type Messages } from './i18n/i18n'

export type {
  FlipReelOptions,
  Story,
  VideoStory,
  ImageStory,
  Feed,
  Category,
  AdAdapter,
  AdHandle,
  AdSlotContext,
  FeedAdapter,
  StateStore,
  FlipReelEventMap,
} from '@flipatic/flip-reel-core'
export {
  MemoryStateStore,
  createLocalStorageStateStore,
  FLIP_REEL_VERSION,
} from '@flipatic/flip-reel-core'

export function mount(target: HTMLElement, options: FlipReelOptions): FlipReelReels {
  const element = document.createElement('flip-reel') as FlipReelReels
  element.options = options
  target.appendChild(element)
  return element
}
