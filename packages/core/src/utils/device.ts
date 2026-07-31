export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iosDevice = /iP(hone|ad|od)/.test(ua)
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iosDevice || iPadOS
}

export function canHover(): boolean {
  if (typeof matchMedia === 'undefined') return false
  return matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function prefersReducedMotion(): boolean {
  if (typeof matchMedia === 'undefined') return false
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function prefersSaveData(): boolean {
  if (typeof navigator === 'undefined') return false
  const connection = (navigator as { connection?: { saveData?: boolean } }).connection
  return Boolean(connection?.saveData)
}

export function hasSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false
  const connection = (navigator as { connection?: { effectiveType?: string } }).connection
  const type = connection?.effectiveType
  return type === 'slow-2g' || type === '2g'
}
