import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      USSD_API_BASE_URL: process.env.USSD_API_BASE_URL,
      X_APP_ID: process.env.X_APP_ID,
      X_APP_VERSION: process.env.X_APP_VERSION,
      HOME_URL: process.env.HOME_URL || 'http://localhost:3000',
    },
  },
  // ...
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt', '@nuxt/icon'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
})