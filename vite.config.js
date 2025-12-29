import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true,
        cors: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
        chunkSizeWarningLimit: 1500
    },
    preview: {
        port: 4173
    }
});
