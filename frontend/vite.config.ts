import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Lắng nghe trên mọi card mạng (0.0.0.0) để chia sẻ ra ngoài mạng LAN hoặc Dev Tunnels
    port: 5173,
    allowedHosts: true, // Cho phép mọi domain như devtunnels.ms, ngrok, LAN IP kết nối
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
