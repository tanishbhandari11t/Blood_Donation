import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Blood_Donation/',
  optimizeDeps: {
    include: ['prop-types']
  }
})
