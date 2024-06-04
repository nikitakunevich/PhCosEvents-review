// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/content'],
	css: ['vue-toast-notification/dist/theme-bootstrap.css'],
	nitro: {
		prerender: {
			routes: ['/'],
		},
	},
	/*   typescript : {
    typeCheck: true
  } */
})
