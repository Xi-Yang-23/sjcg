import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // secure: false,
        // changeOrigin: true,
        target: 'http://127.0.0.1:3000',
        // rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
      }
    }
  },

  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      // sassVariables: 'src/quasar-variables.sass'
      sassVariables: 'src/assets/quasar-variables.sass'
    }),

  ],

  base: './',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

