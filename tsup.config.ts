import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['app/index.tsx', 'server/main.ts'],
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
})
