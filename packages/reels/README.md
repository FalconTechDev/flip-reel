# @flipatic/flip-reel

The embeddable [FlipReel](https://github.com/Flipatic/flip-reel) stories/reels widget for
publishers: Lit web components (`<flip-reel>`, `<flip-reel-rail>`, `<flip-reel-player>`) with
Shadow DOM style isolation, design tokens, `pl`/`en` i18n, and view-gated ad breaks behind a
stable adapter contract.

## Installation

```bash
npm i @flipatic/flip-reel
```

Or without a bundler, straight from a CDN (pin the version in production):

```html
<script type="module" src="https://unpkg.com/@flipatic/flip-reel"></script>
```

## Minimal example

Drop-in:

```html
<flip-reel feed="https://publisher.example/reels.json"></flip-reel>
```

Programmatic:

```ts
import { mount } from '@flipatic/flip-reel'

mount(document.querySelector('#reels')!, {
  feed: 'https://publisher.example/reels.json',
  locale: 'pl',
  ads: { every: 4 },
})
```

Listen to typed widget events on the element:

```ts
document.querySelector('flip-reel')!.addEventListener('flip-reel:like', (event) => {
  console.log(event.detail.storyId, event.detail.liked)
})
```

## Documentation

- [Architecture](../../docs/architecture.md)
- [API reference](../../docs/reference) — options, events, CSS variables, adapters

## License

Apache-2.0
