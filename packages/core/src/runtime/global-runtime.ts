import { MediaScheduler } from './media-scheduler'

export const FLIP_REEL_VERSION = '0.1.2'

const NAMESPACE = '__FLIP_REEL__'

export interface GlobalRuntime {
  version: string
  scheduler: MediaScheduler
  instances: Set<string>
}

export function getRuntime(): GlobalRuntime {
  const root = globalThis as Record<string, unknown>
  const existing = root[NAMESPACE] as GlobalRuntime | undefined
  if (existing) {
    if (existing.version !== FLIP_REEL_VERSION) {
      console.warn(
        `[flip-reel] version mismatch: page already runs ${existing.version}, this build is ${FLIP_REEL_VERSION}`,
      )
    }
    return existing
  }

  const runtime: GlobalRuntime = {
    version: FLIP_REEL_VERSION,
    scheduler: new MediaScheduler(),
    instances: new Set<string>(),
  }
  root[NAMESPACE] = runtime
  return runtime
}
