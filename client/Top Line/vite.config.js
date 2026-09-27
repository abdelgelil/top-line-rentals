import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../', // Reads .env from root
  root: import.meta.dirname,
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
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@clerk')) return 'clerk';
          if (id.includes('i18next')) return 'i18n';
          if (id.includes('axios')) return 'http';
          if (id.includes('lucide-react')) return 'icons';
        },
      },
    },
  },
});