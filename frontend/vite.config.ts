import {defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default (mode: string) => {
    const env = loadEnv(mode, process.cwd(), '');

    return defineConfig({
        plugins: [react()],
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_BACKEND_URL,
                    changeOrigin: true,
                },
            },
        },
    });
};