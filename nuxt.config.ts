import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false,

  css: ['~/assets/global.css'],

  app: {
    head: {
      titleTemplate: '%s - PandaTO damage calculator',
      title: 'PandaTO damage calculator',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'damage calculator for PandaTo'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Jacques+Francois+Shadow&family=Chakra+Petch:wght@600;700&display=swap'
        }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=UA-168008891-1',
          async: true
        },
        {
          innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','UA-168008891-1');`
        }
      ]
    }
  },

  build: {
    transpile: ['vuetify']
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins!.push(vuetify({ autoImport: true }) as any)
      })
    }
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    }
  },

  nitro: {
    preset: 'static'
  },

  compatibilityDate: '2024-07-01'
})
