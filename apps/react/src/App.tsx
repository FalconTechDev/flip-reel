import { Reels } from '@flipatic/flip-reel-react'
import { createDemoOptions } from '@flipatic/flip-reel-demo-shared'

const options = createDemoOptions()

export function App() {
  return (
    <>
      <header className="demo-header">
        <div className="demo-header__inner">
          <div className="demo-brand">
            <img src="/brand/autentika.svg" alt="Autentika" />
          </div>
          <span className="demo-badge">React</span>
        </div>
      </header>
      <main className="demo-main">
        <p className="demo-lede">
          A React page embedding the FlipReel widget via <code>@flipatic/flip-reel-react</code>.
          Hover a card to preview, click to open the full-screen player with categories, ads and
          interactions.
        </p>
        <Reels
          options={options}
          onOpen={(event) => console.info('[react] open', (event as CustomEvent).detail)}
          onShare={(event) => console.info('[react] share', (event as CustomEvent).detail)}
        />
      </main>
    </>
  )
}
