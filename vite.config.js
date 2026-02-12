import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.split('\\').join('/');

          if (normalizedId.includes('/src/mocks/')) {
            return 'mock-data';
          }

          if (normalizedId.includes('/src/pages/')) {
            return 'pages';
          }

          if (!normalizedId.includes('/node_modules/')) return;

          if (
            normalizedId.includes('/react-dom/') ||
            normalizedId.includes('/react/')
          ) {
            return 'react-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  preview: { port: 5173 },
});
