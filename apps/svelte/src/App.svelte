<script lang="ts">
  import { onMount } from 'svelte'
  import { createDemoOptions } from '@flipatic/flip-reel-demo-shared'
  import type { FlipReelReels } from '@flipatic/flip-reel'

  let el: FlipReelReels | undefined
  const options = createDemoOptions()

  onMount(() => {
    if (el) el.options = options
  })
</script>

<header class="demo-header">
  <div class="demo-header__inner">
    <div class="demo-brand"><img src="/brand/autentika.svg" alt="Autentika" /></div>
    <span class="demo-badge">Svelte</span>
  </div>
</header>
<main class="demo-main">
  <p class="demo-lede">
    A Svelte page embedding the FlipReel widget as a native custom element. Hover a card to
    preview, click to open the full-screen player with categories, ads and interactions.
  </p>
  <flip-reel bind:this={el}></flip-reel>
</main>
