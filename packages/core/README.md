# @flipatic/flip-reel-core

Headless engine of the [FlipReel](https://github.com/Flipatic/flip-reel) widget: config
resolution, feed loading and normalization, the player and ad state machines, the page-global
`MediaScheduler`, and the state-store contract. No DOM rendering — the UI lives in
[`@flipatic/flip-reel`](../reels).

Add it directly only when you build custom adapters or drive the engine yourself; the widget
package depends on it already.

## Installation

```bash
npm i @flipatic/flip-reel-core
```

## Minimal example

```ts
import {
  EventBus,
  MemoryStateStore,
  PlayerController,
  resolveConfig,
  type FlipReelEventMap,
} from '@flipatic/flip-reel-core'

const events = new EventBus<FlipReelEventMap>()
events.on('flip-reel:view', ({ storyId, index }) => console.log('viewed', storyId, index))

const player = new PlayerController({
  config: resolveConfig({ feed: { stories } }),
  store: new MemoryStateStore(),
  events,
})
player.setStories(stories)
player.open(stories[0].id)
```

## Documentation

- [Architecture](../../docs/architecture.md)
- [API reference](../../docs/reference)

## License

Apache-2.0
