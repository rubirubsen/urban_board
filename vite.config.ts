import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: '127.0.0.1',
    proxy: {
      '/api/transport': {
        target: 'https://v6.db.transport.rest',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/transport/, ''),
      },
      '/api/autobahn': {
        target: 'https://verkehr.autobahn.de/oapi/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/autobahn/, ''),
      },
      '/api/overpass': {
        target: 'https://overpass-api.de/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/overpass/, ''),
      },
      '/api/opensensemap': {
        target: 'https://api.opensensemap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/opensensemap/, ''),
      },
      '/api/pegelonline': {
        target: 'https://www.pegelonline.wsv.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pegelonline/, ''),
      }
    },
  },
});
