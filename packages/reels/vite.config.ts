import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    target: 'es2022',
    outDir: 'dist/bundle',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: 'FlipReel',
      formats: ['es', 'iife'],
      fileName: (format) => (format === 'iife' ? 'flip-reel.iife.js' : 'flip-reel.js'),
    },
  },
})
