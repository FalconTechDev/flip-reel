import { svg, type SVGTemplateResult } from 'lit'

const outlinePaths = {
  'arrow-left': svg`<path d="M19 12H5M12 19L5 12L12 5" />`,
  'arrow-right': svg`<path d="M5 12H19M12 5L19 12L12 19" />`,
  'arrow-up': svg`<path d="M12 19V5M5 12L12 5L19 12" />`,
  'arrow-down': svg`<path d="M12 5V19M19 12L12 19L5 12" />`,
  'arrow-up-right': svg`<path d="M17 17V7H7M17 7L7 17" />`,
  'chevron-up': svg`<path d="M18 15L12 9L6 15" />`,
  'chevron-down': svg`<path d="M6 9L12 15L18 9" />`,
  'chevron-left': svg`<path d="M15 18L9 12L15 6" />`,
  'chevron-right': svg`<path d="M9 18L15 12L9 6" />`,
  x: svg`<path d="M18 6L6 18M6 6L18 18" />`,
  heart: svg`<path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z" />`,
  send: svg`<path d="M11 13L2 9L22 2L15 22L11 13ZM22 2L11 13" />`,
  'external-link': svg`<path d="M21 9V3H15M21 3L10 14M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" />`,
  'volume-2': svg`<path d="M11 5L6 9H2V15H6L11 19V5Z" /><path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" /><path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" />`,
  'volume-x': svg`<path d="M11 5L6 9H2V15H6L11 19V5Z" /><path d="M22 9L16 15" /><path d="M16 9L22 15" />`,
  'skip-forward': svg`<path d="M5 4L15 12L5 20V4Z" /><path d="M19 5V19" />`,
} as const

const solidShapes = {
  'pause-fill': svg`<g transform="translate(8 5)"><path d="M5 1.5C5 0.671573 5.67157 0 6.5 0C7.32843 0 8 0.671573 8 1.5V12.5C8 13.3284 7.32843 14 6.5 14C5.67157 14 5 13.3284 5 12.5V1.5Z" /><path d="M0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5V12.5C3 13.3284 2.32843 14 1.5 14C0.671573 14 0 13.3284 0 12.5V1.5Z" /></g>`,
} as const

export type IconName = keyof typeof outlinePaths | keyof typeof solidShapes | 'play-fill'

const stroke = (inner: SVGTemplateResult): SVGTemplateResult =>
  svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`

const solid = (inner: SVGTemplateResult): SVGTemplateResult =>
  svg`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${inner}</svg>`

const playGlyph = (): SVGTemplateResult =>
  svg`<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 3L20 12L6 21V3Z" /></svg>`

export function icon(name: IconName, filled = false): SVGTemplateResult {
  if (name === 'play-fill') return playGlyph()
  if (name === 'pause-fill') return solid(solidShapes['pause-fill'])
  const inner = outlinePaths[name as keyof typeof outlinePaths]
  return name === 'heart' && filled ? solid(inner) : stroke(inner)
}

export function brandMark(): SVGTemplateResult {
  return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <path d="M9 8v8M15 8v8" />
  </svg>`
}
