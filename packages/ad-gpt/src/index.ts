import type { AdAdapter, AdHandle, AdSlotContext } from '@flipatic/flip-reel-core'
import type { GptSlot, GptSlotRenderEndedEvent } from './googletag'

const DEFAULT_SCRIPT = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js'

/** Options for {@link createGptAdAdapter}. */
export interface GptAdapterOptions {
  /** Google Ad Manager ad unit path, e.g. `/1234567/flip-reel`. */
  adUnitPath: string
  /**
   * Creative sizes requested from GAM.
   * @defaultValue [[300, 250]]
   */
  sizes?: Array<[number, number]>
  /**
   * URL the GPT library is loaded from.
   * @defaultValue the official Google-hosted gpt.js
   */
  scriptUrl?: string
  /** Key-value targeting applied to the slot. */
  targeting?: Record<string, string | string[]>
}

class GptAdAdapter implements AdAdapter {
  private libraryReady?: Promise<void>

  constructor(private readonly options: GptAdapterOptions) {}

  async request(context: AdSlotContext): Promise<AdHandle | null> {
    await this.ensureLibrary()
    const googletag = window.googletag
    if (!googletag) return null

    const elementId = `flip-reel-gpt-${context.index}-${Math.floor(performance.now())}`
    const slotElement = document.createElement('div')
    slotElement.id = elementId
    slotElement.style.width = '100%'
    slotElement.style.height = '100%'
    context.container.appendChild(slotElement)

    return new Promise<AdHandle | null>((resolve) => {
      googletag.cmd.push(() => {
        const slot = googletag.defineSlot(
          this.options.adUnitPath,
          this.options.sizes ?? [[300, 250]],
          elementId,
        )
        if (!slot) {
          slotElement.remove()
          resolve(null)
          return
        }
        const pubads = googletag.pubads()
        const onRenderEnded = (event: GptSlotRenderEndedEvent): void => {
          if (event.slot !== slot) return
          pubads.removeEventListener('slotRenderEnded', onRenderEnded)
          if (event.isEmpty) {
            googletag.destroySlots([slot])
            slotElement.remove()
            resolve(null)
            return
          }
          resolve({
            destroy: () => {
              googletag.cmd.push(() => googletag.destroySlots([slot]))
              slotElement.remove()
            },
          })
        }
        pubads.addEventListener('slotRenderEnded', onRenderEnded)
        slot.addService(pubads)
        this.applyTargeting(slot)
        googletag.enableServices()
        googletag.display(elementId)
      })
    })
  }

  private applyTargeting(slot: GptSlot): void {
    for (const [key, value] of Object.entries(this.options.targeting ?? {})) {
      slot.setTargeting(key, value)
    }
  }

  private ensureLibrary(): Promise<void> {
    if (window.googletag?.apiReady) return Promise.resolve()
    if (!this.libraryReady) {
      this.libraryReady = new Promise((resolve, reject) => {
        if (!window.googletag) {
          window.googletag = { cmd: [] } as unknown as NonNullable<Window['googletag']>
        }
        if (document.querySelector('script[data-flip-reel-gpt]')) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = this.options.scriptUrl ?? DEFAULT_SCRIPT
        script.async = true
        script.setAttribute('data-flip-reel-gpt', '')
        script.addEventListener('load', () => resolve())
        script.addEventListener('error', () => reject(new Error('Failed to load GPT library')))
        document.head.appendChild(script)
      })
    }
    return this.libraryReady
  }
}

/**
 * Creates the reference Google Ad Manager (GPT) ad adapter: loads gpt.js on
 * first request, renders one slot per ad break, and reports empty responses
 * as no-fill so the widget can dismiss the break.
 */
export function createGptAdAdapter(options: GptAdapterOptions): AdAdapter {
  return new GptAdAdapter(options)
}
