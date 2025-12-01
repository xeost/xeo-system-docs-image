// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid({
			theme: 'forest',
			autoTheme: true,
		}),
		starlight({
			title: 'Wordsus Docs',
			head: [
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
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/wordsus' }],
			sidebar: [
				{
					label: 'System Design',
					items: [
						{ label: 'Overview', slug: 'system-design/01-overview' },
					],
				},
			],
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
			},
			defaultLocale: 'root',
		}),
	],
});
