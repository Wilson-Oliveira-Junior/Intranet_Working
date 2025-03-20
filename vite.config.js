import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@components': path.resolve(__dirname, 'resources/js/components'),
            '@layouts': path.resolve(__dirname, 'resources/js/Layouts'),
        },
    },
    server: {
        cors: true,
        mimeTypes: {
            'application/javascript': ['js', 'jsx', 'ts', 'tsx'],
        },
    },
    build: {
        sourcemap: false, // Desativa os mapas de código
    },
});
