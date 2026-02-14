import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            background: '#0f172a',
            surface: '#1e293b',
            primary: '#1565C0',
            accent: '#424242',
            secondary: '#FF8F00',
            info: '#26A69A',
            warning: '#FFC107',
            error: '#FF3D00',
            success: '#69F0AE'
          }
        }
      }
    }
  })
  app.vueApp.use(vuetify)
})
