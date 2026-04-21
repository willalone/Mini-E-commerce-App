import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** В dev браузер ходит на localhost — прокси обходит CORS и часть сетевых блокировок. */
const dummyjsonProxy = {
  '/api-dummyjson': {
    target: 'https://dummyjson.com',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api-dummyjson/, ''),
  },
} as const

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: dummyjsonProxy,
  },
  preview: {
    proxy: dummyjsonProxy,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
