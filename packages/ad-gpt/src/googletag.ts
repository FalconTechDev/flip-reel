export interface GptSlot {
  addService(service: unknown): GptSlot
  setTargeting(key: string, value: string | string[]): GptSlot
}

export interface GptSlotRenderEndedEvent {
  slot: GptSlot
  isEmpty: boolean
}

export interface GptPubAdsService {
  addEventListener(
    event: 'slotRenderEnded',
    listener: (event: GptSlotRenderEndedEvent) => void,
  ): void
  removeEventListener(
    event: 'slotRenderEnded',
    listener: (event: GptSlotRenderEndedEvent) => void,
  ): void
}

export interface GoogleTag {
  apiReady?: boolean
  cmd: Array<() => void>
  defineSlot(adUnitPath: string, sizes: Array<[number, number]>, elementId: string): GptSlot | null
  pubads(): GptPubAdsService
  enableServices(): void
  display(elementId: string): void
  destroySlots(slots?: unknown[]): boolean
}

declare global {
  interface Window {
    googletag?: GoogleTag
  }
}
