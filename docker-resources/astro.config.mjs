// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightConfig from './starlight.config.mjs';

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid({
			theme: 'forest',
			autoTheme: true,
		}),
		starlight({
			...starlightConfig,
			head: [
				...(starlightConfig.head || []),
				{
					tag: 'script',
					attrs: {
						src: 'https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js',
					},
				},
				{
					tag: 'script',
					attrs: {
						src: '/mermaid-zoom.js',
						defer: true,
					},
				},
			],
			locales: starlightConfig.locales || {
				root: {
					label: 'English',
					lang: 'en',
				},
			},
			defaultLocale: starlightConfig.defaultLocale || 'root',
		}),
	],
});
