# Theming

The widget renders inside Shadow DOM, so regular host CSS cannot reach it. Theming happens
through CSS custom properties, which pierce the shadow boundary. Set them on the element from
the host page, or pass them via `options.theme`:

```css
flip-reel {
  --flip-reel-heading-color: #0a0a0a;
  --flip-reel-progress-fill: #ff4d6d;
  --flip-reel-radius-card: 12px;
}
```

```ts
mount(target, { feed, theme: { '--flip-reel-progress-fill': '#ff4d6d' } })
```

## Theming knobs

High-level variables read with fallbacks — the intended public theming surface:

| Variable                     | Default                  | Affects                                           |
| ---------------------------- | ------------------------ | ------------------------------------------------- |
| `--flip-reel-font`           | Inter + system stack     | All text                                          |
| `--flip-reel-heading-color`  | `#171717`                | Rail heading, error message                       |
| `--flip-reel-heading-size`   | `30px`                   | Rail heading                                      |
| `--flip-reel-surface`        | `#0a0a0a`                | Player background                                 |
| `--flip-reel-on-surface`     | `#ffffff`                | Text and icons on the player surface, focus rings |
| `--flip-reel-overlay`        | `rgba(10, 10, 10, 0.55)` | Dialog backdrop                                   |
| `--flip-reel-like`           | `--flip-reel-accent`     | Liked heart color                                 |
| `--flip-reel-accent`         | `hsl(358 85% 52%)`       | Accent color (like burst)                         |
| `--flip-reel-progress-fill`  | `#ffffff`                | Progress bar fill                                 |
| `--flip-reel-progress-track` | translucent white        | Progress bar track                                |
| `--flip-reel-radius-card`    | `16px`                   | Rail card and media corners                       |
| `--flip-reel-gap`            | `16px`                   | Rail card gap                                     |

## Design tokens

Lower-level tokens defined on `:host` in every element. Overriding them restyles the widget
wholesale; they are stable but more granular:

- **Palette**: `--flip-reel-white`, `--flip-reel-brand-600/700/800`,
  `--flip-reel-grey-100/200/400/500/900/950`, `--flip-reel-neutral-200/300/800/900/950`,
  `--flip-reel-rose-500`
- **Controls**: `--flip-reel-control-bg`, `--flip-reel-control-bg-hover`
- **Alpha ramps**: `--flip-reel-alpha-black-4…80`, `--flip-reel-alpha-white-10…85`
- **Radii**: `--flip-reel-radius-card`, `--flip-reel-radius-control`,
  `--flip-reel-radius-pill`, `--flip-reel-radius-lg`, `--flip-reel-radius-badge`
- **Shadows**: `--flip-reel-shadow-focus`, `--flip-reel-shadow-card`,
  `--flip-reel-shadow-button-secondary`
- **Motion**: `--flip-reel-ease-emphasized`, `--flip-reel-modal-open` (250ms),
  `--flip-reel-modal-close` (150ms), `--flip-reel-pill-dur` (300ms)

The widget honors `prefers-reduced-motion: reduce` by skipping scroll animations.
