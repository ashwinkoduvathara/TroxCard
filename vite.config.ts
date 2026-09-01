import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['bcard.troxcard.in', 'localhost', '127.0.0.1'],
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['bcard.troxcard.in', 'localhost', '127.0.0.1'],
  },
  plugins: [
    devtools({
      injectSource: {
        enabled: false,
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
