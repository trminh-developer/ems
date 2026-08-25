import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'SUPABASE_', 'supabase'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
