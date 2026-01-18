import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      // 🔴 force full reload instead of hot reload
      usePolling: true,
    },
  },
})
