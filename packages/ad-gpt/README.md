# @flipatic/flip-reel-ad-gpt

Reference Google Ad Manager (GPT) ad adapter for the
[FlipReel](https://github.com/autentika/flip-reel) widget. Loads `gpt.js` on demand, renders
one slot per ad break, and reports empty responses as no-fill so the widget dismisses the
break.

## Installation

```bash
npm i @flipatic/flip-reel-ad-gpt
```

## Minimal example

```ts
import { mount } from '@flipatic/flip-reel'
import { createGptAdAdapter } from '@flipatic/flip-reel-ad-gpt'

mount(document.querySelector('#reels')!, {
  feed: 'https://publisher.example/reels.json',
  adapters: {
    ad: createGptAdAdapter({
      adUnitPath: '/1234567/flip-reel',
      sizes: [[300, 250]],
      targeting: { placement: 'reels' },
    }),
  },
})
```

Any ad tech can be plugged in the same way by implementing the `AdAdapter` contract from
`@flipatic/flip-reel-core` — see the [adapter reference](../../docs/reference/adapters.md).

## License

Apache-2.0
