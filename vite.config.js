import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { loadEnv as loadViteEnv } from 'vite';
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    base: loadViteEnv(mode, '.').VITE_BASE_PATH ?? '/',
    server: {
        host: '0.0.0.0',
        port: 5180,
        allowedHosts: true,
    },
    preview: {
        host: '0.0.0.0',
        port: 5180,
        allowedHosts: true,
    },
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        css: true,
        globals: true,
    },
}));
