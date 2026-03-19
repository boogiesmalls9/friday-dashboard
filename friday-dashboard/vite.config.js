import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        }
      }
    },
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    react(),
  ]
})
