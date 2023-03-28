import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';
import buildComplete from './src/plugins/build-complete';

import makeManifest from './src/plugins/make-manifest';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    console.log(mode);

    const isDevelopment = mode === 'development' || mode === 'dev';

    const outputDirectory = isDevelopment ? '.cache/build/dev' : '.cache/build/prod';

    return {
        build: {
            emptyOutDir: false,
            lib: {
                entry: 'src/content/content-script.ts',
                name: 'content',
                fileName: 'content-script',
                formats: ['iife'],
            },
            outDir: outputDirectory,
            minify: 'terser',
            // https://terser.org/docs/api-reference#minify-options
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            sourcemap: isDevelopment,
        },
        cacheDir: isDevelopment ? '.cache/.vite/dev' : '.cache/.vite/prod',
        plugins: [
            react(),
            buildComplete({ buildName: 'content', outDir: outputDirectory }),
            replace({
                values: {
                    'process.env.NODE_ENV': `"${mode || 'production'}"`,
                },
            }),
            makeManifest(outputDirectory),
        ],
        publicDir: false,
    };
});
