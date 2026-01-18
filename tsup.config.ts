import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  onSuccess: 'chmod +x dist/index.js',
})
