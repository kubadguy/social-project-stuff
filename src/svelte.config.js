import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');
const repo = 'social-project-stuff';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: 'index.html'
        }),

        paths: {
            base: dev ? '' : `/${repo}`,
        },

        prerender: {
            handleHttpError: 'warn'
        }
    }
};

export default config;
