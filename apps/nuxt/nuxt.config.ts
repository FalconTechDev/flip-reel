export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  telemetry: false,
  css: ['@flipatic/flip-reel-demo-shared/demo.css'],
  build: {
    transpile: ['@flipatic/flip-reel', '@flipatic/flip-reel-demo-shared'],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('flip-reel-'),
    },
  },
})
