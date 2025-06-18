import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Địa chỉ của server backend
        changeOrigin: true, // Cần thiết cho các virtual host
        secure: false,      // Nếu server backend không dùng HTTPS
      },
    },
  },
})
