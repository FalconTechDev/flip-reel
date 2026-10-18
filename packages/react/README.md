# @flipatic/flip-reel-react

React bindings for the [FlipReel](https://github.com/Flipatic/flip-reel) widget via
`@lit/react`: `Reels`, `Rail`, and `Player` components with typed event props.

> Not published to npm yet — the web component in
> [`@flipatic/flip-reel`](../reels) works natively in React as well.

## Installation

```bash
npm i @flipatic/flip-reel-react
```

Requires `react >= 18`.

## Minimal example

```tsx
import { Reels } from '@flipatic/flip-reel-react'

export function App() {
  return (
    <Reels
      options={{ feed: 'https://publisher.example/reels.json' }}
      onView={(event) => console.log('viewed', event.detail.storyId)}
      onReadMore={(event) => {
        event.preventDefault()
        openInAppBrowser(event.detail.link)
      }}
      onReelsError={(event) => console.warn(event.detail.scope, event.detail.message)}
    />
  )
}
```

Widget errors arrive on `onReelsError` (not `onError`, which is React's native handler).

## Documentation

- [API reference](../../docs/reference) — all event props and payloads

## License

Apache-2.0
