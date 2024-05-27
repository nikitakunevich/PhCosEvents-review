/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				main: {
					900: '#05034f',
					800: '#081660',
					700: '#152472',
					600: '#102b78',
					500: '#2d4893',
					400: '#597eb6',
					300: '#a0c3e3',
					200: '#d6e7f7',
					100: '#f1f8ff',
				},
				grey: {
					900: '#17191e',
					800: '#363a44',
					700: '#616673',
					600: '#8a909f',
					500: '#9ca1ae',
					400: '#b3b8c2',
					300: '#d3d5db',
					200: '#e6e7e9',
					100: '#f4f4f5',
				},
			},
			screens: {
				container: '960px',
				desktop: '768px',
				tablet: '420px',
			},
		},
		fontFamily: {
			sans: ['Montserrat', 'system-ui', 'sans-serif'],
		},
	},

	plugins: [],
}

