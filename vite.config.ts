//configure dotenv
import dotenv from 'dotenv';
dotenv.config();

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import buildComplete from './src/plugins/build-complete';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const isDevelopment = mode === 'development' || mode === 'dev';

    const outputDirectory = isDevelopment ? '.cache/build/dev' : '.cache/build/prod';

    return {
        build: {
            emptyOutDir: false,
            outDir: outputDirectory,
            minify: 'terser',
            // https://terser.org/docs/api-reference#minify-options
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            rollupOptions: {
                input: {
                    background: process.env.manifestVersion === '2' ? 'src/background/index.html' : 'src/background/service-worker.ts',
                    action: 'src/action/index.html',
                },
                output: {
                    entryFileNames: (chunk) => `src/${chunk.name}/index.js`,
                },
            },
            sourcemap: isDevelopment,
        },
        cacheDir: isDevelopment ? '.cache/.vite/dev' : '.cache/.vite/prod',
        plugins: [
            react(),
            buildComplete({
                buildName: 'base',
                outDir: outputDirectory,
            }),
        ],
    };
});
