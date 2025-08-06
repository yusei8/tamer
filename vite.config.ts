import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Ajout du plugin pour copier le worker PDF
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
          dest: 'rachef-uploads',
          rename: 'pdf.worker.min.js'
        }
      ]
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuration supplémentaire pour le build
  build: {
    assetsInclude: ['**/*.pdf', '**/*.worker.js'],
    rollupOptions: {
      output: {
        manualChunks: undefined, // Désactive le split des chunks pour le worker
      }
    }
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist'] // Empêche Vite d'optimiser pdfjs-dist
  }
}));