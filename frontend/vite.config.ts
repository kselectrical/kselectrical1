import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    minify: 'oxc',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Granular code splitting for optimal long-term caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase/firestore')) return 'vendor-firestore';
            if (id.includes('firebase/auth')) return 'vendor-firebase-auth';
            if (id.includes('firebase')) return 'vendor-firebase-core';
            if (id.includes('lucide-react') || id.includes('lucide')) return 'vendor-lucide';
            if (id.includes('react-dom')) return 'vendor-react-dom';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('react-helmet-async')) return 'vendor-helmet';
            return 'vendor-others';
          }
        },
        // Consistent asset naming for long-term caching
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
  },
  // Optimize deps for faster dev starts
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
