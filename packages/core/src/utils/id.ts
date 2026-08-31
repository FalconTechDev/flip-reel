let counter = 0

/** Returns a page-unique widget instance id, reported in `flip-reel:ready`. */
export function createInstanceId(): string {
  counter += 1
  return `flip-reel-${counter.toString(36)}-${Math.floor(performance.now()).toString(36)}`
}
