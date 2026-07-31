import { css } from 'lit'

export const tokens = css`
  :host {
    --flip-reel-white: #ffffff;
    --flip-reel-brand-600: #2563eb;
    --flip-reel-brand-700: #1d4ed8;
    --flip-reel-brand-800: #1e40af;
    --flip-reel-grey-100: #f4f4f5;
    --flip-reel-grey-200: #e4e4e7;
    --flip-reel-grey-400: #a1a1aa;
    --flip-reel-grey-500: #71717a;
    --flip-reel-grey-900: #18181b;
    --flip-reel-grey-950: #09090b;
    --flip-reel-rose-500: #f43f5e;

    --flip-reel-neutral-200: #e5e5e5;
    --flip-reel-neutral-300: #d4d4d4;
    --flip-reel-neutral-800: #262626;
    --flip-reel-neutral-900: #171717;
    --flip-reel-neutral-950: #0a0a0a;
    --flip-reel-accent: hsl(358 85% 52%);

    --flip-reel-control-bg: rgba(23, 23, 23, 0.8);
    --flip-reel-control-bg-hover: rgba(23, 23, 23, 0.95);

    --flip-reel-alpha-black-4: #09090b0a;
    --flip-reel-alpha-black-8: #09090b14;
    --flip-reel-alpha-black-12: #09090b1f;
    --flip-reel-alpha-black-40: #09090b66;
    --flip-reel-alpha-black-56: #09090b8f;
    --flip-reel-alpha-black-60: rgba(0, 0, 0, 0.6);
    --flip-reel-alpha-black-64: #09090ba3;
    --flip-reel-alpha-black-80: #09090bcc;
    --flip-reel-alpha-white-10: rgba(255, 255, 255, 0.1);
    --flip-reel-alpha-white-15: rgba(255, 255, 255, 0.15);
    --flip-reel-alpha-white-16: #ffffff29;
    --flip-reel-alpha-white-24: #ffffff3d;
    --flip-reel-alpha-white-25: rgba(255, 255, 255, 0.25);
    --flip-reel-alpha-white-70: rgba(255, 255, 255, 0.7);
    --flip-reel-alpha-white-72: #ffffffb8;
    --flip-reel-alpha-white-85: rgba(255, 255, 255, 0.85);

    --flip-reel-font:
      'Inter', 'Inter Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;

    --flip-reel-radius-card: 16px;
    --flip-reel-radius-control: 9999px;
    --flip-reel-radius-pill: 9999px;
    --flip-reel-radius-lg: 8px;
    --flip-reel-radius-badge: 6px;
    --flip-reel-gap: 16px;

    --flip-reel-shadow-focus: 0 0 0 2px var(--flip-reel-white), 0 0 0 4px rgba(29, 78, 216, 0.6);
    --flip-reel-shadow-card:
      0 2px 4px 0 var(--flip-reel-alpha-black-4), 0 1px 2px -1px var(--flip-reel-alpha-black-8),
      0 0 0 1px var(--flip-reel-alpha-black-8);
    --flip-reel-shadow-button-secondary:
      0 0 0 1px var(--flip-reel-alpha-black-8), 0 1px 2px 0 var(--flip-reel-alpha-black-12);

    --flip-reel-ease-emphasized: cubic-bezier(0.22, 1, 0.36, 1);
    --flip-reel-modal-open: 250ms;
    --flip-reel-modal-close: 150ms;
    --flip-reel-pill-dur: 300ms;

    font-family: var(--flip-reel-font);
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`
