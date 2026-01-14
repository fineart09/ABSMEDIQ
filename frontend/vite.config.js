import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // เมื่อเรียกใช้ /api ใน frontend จะถูกส่งต่อไปยัง Java Backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 5173,
    proxy: {
      // ควรใส่ proxy ใน preview ด้วยเพื่อให้ npm run preview ทดสอบ API ได้จริง
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})