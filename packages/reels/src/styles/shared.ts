import { css } from 'lit'

export const controlButton = css`
  .control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 0;
    border: none;
    border-radius: var(--flip-reel-radius-control, 9999px);
    background: var(--flip-reel-control-bg, rgba(23, 23, 23, 0.8));
    color: var(--flip-reel-on-surface, #ffffff);
    cursor: pointer;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;
  }

  .control:hover {
    background: var(--flip-reel-control-bg-hover, rgba(23, 23, 23, 0.95));
  }

  .control:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--flip-reel-on-surface, #ffffff);
  }

  .control:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .control svg {
    display: block;
    width: 24px;
    height: 24px;
  }
`

export const railControl = css`
  .rail-control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: var(--flip-reel-radius-control, 9999px);
    background: var(--flip-reel-neutral-900, #171717);
    color: var(--flip-reel-white, #ffffff);
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
  }

  .rail-control:hover {
    background: var(--flip-reel-neutral-800, #262626);
  }

  .rail-control:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px var(--flip-reel-white, #ffffff),
      0 0 0 4px var(--flip-reel-neutral-900, #171717);
  }

  .rail-control:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .rail-control svg {
    display: block;
    width: 20px;
    height: 20px;
  }
`

export const visuallyHidden = css`
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`
