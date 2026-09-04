import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Non-blocking CSS load — prevents render-blocking stylesheet
      name: 'lazy-load-css',
      transformIndexHtml(html) {
        return html.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)"\s*\/?>/g,
          '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.onload=null;this.media=\'all\'">'
        );
      }
    }
  ],
  base: '/',
  build: {
    minify: 'oxc',
    sourcemap: false,
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 600,
    // modulePreload: inlines module preload for faster chunk resolution
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        // Granular code splitting — each chunk cached independently
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Firebase split into 3 separate chunks — only load what's needed
            if (id.includes('firebase/firestore')) return 'vendor-firestore';
            if (id.includes('firebase/auth')) return 'vendor-firebase-auth';
            if (id.includes('firebase')) return 'vendor-firebase-core';
            // UI libraries
            if (id.includes('lucide-react') || id.includes('lucide')) return 'vendor-lucide';
            // React core
            if (id.includes('react-dom')) return 'vendor-react-dom';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('react')) return 'vendor-react';
            // Other vendors grouped together
            return 'vendor-others';
          }
        },
        // Consistent hashed asset naming for long-term browser caching
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

