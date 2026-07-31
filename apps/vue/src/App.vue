<script setup lang="ts">
import { createDemoOptions } from '@flipatic/flip-reel-demo-shared'

const options = createDemoOptions()
</script>

<template>
  <header class="demo-header">
    <div class="demo-header__inner">
      <div class="demo-brand"><img src="/brand/autentika.svg" alt="Autentika" /></div>
      <span class="demo-badge">Vue</span>
    </div>
  </header>
  <main class="demo-main">
    <p class="demo-lede">
      A Vue 3 page embedding the FlipReel widget as a native custom element (options passed via the
      <code>.prop</code> modifier). Hover a card to preview, click to open the full-screen player.
    </p>
    <flip-reel :options.prop="options" />
  </main>
</template>
