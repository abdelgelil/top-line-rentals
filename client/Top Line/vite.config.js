import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../', // Reads .env from root
  root: __dirname,
  plugins: [
    react(),
    tailwindcss(),
  ],
  preview: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: [
      'steadfast-blessing-production-ffff.up.railway.app',
      '.up.railway.app',
      'all'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});