let counter = 0

export function createInstanceId(): string {
  counter += 1
  return `flip-reel-${counter.toString(36)}-${Math.floor(performance.now()).toString(36)}`
}
