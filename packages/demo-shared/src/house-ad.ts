import type { AdAdapter } from '@flipatic/flip-reel'

export function createHouseAdAdapter(): AdAdapter {
  return {
    async request(context) {
      const creative = document.createElement('div')
      creative.style.cssText = [
        'position:absolute',
        'inset:0',
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'justify-content:center',
        'gap:16px',
        'padding:24px',
        'text-align:center',
        'color:#ffffff',
        'background:#000',
      ].join(';')
      creative.innerHTML = [
        '<div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.7">Demo creative</div>',
        '<div style="font-size:26px;font-weight:800;line-height:1.2">Your ad runs here</div>',
        '<p style="margin:0;max-width:28ch;opacity:0.85">This slot hosts arbitrary ad code from any ad server while the widget keeps timing, label and countdown.</p>',
        '<a href="https://example.com" target="_blank" rel="noopener" style="margin-top:8px;padding:10px 20px;border-radius:9999px;background:#ffffff;color:#111111;font-weight:700;text-decoration:none">Learn more</a>',
      ].join('')
      context.container.appendChild(creative)
      return {
        destroy: () => creative.remove(),
      }
    },
  }
}
