import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      // Proxy short code redirects to backend
      // This regex matches any path that looks like a short code (not /api or /dashboard)
      '^/[a-zA-Z0-9_-]{6}$': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
