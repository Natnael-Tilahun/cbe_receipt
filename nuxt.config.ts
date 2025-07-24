import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  nitro: {
    // preset: "vercel",
    routeRules: {
      "/**": {
        headers: {
          "x-powered-by": "",
          server: "",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      },
    },
  },
  ssr: true,

  runtimeConfig: {
    public: {
      // Only expose non-sensitive configuration to client
      HOME_URL:
      process.env.HOME_URL || "https://cbe-receipt.vercel.app/receipt-generator",
    },
  },

      // Build-time environment replacement
      vite: {
        define: {
          // Replace sensitive URLs at build time
          __API_BASE_URL__: JSON.stringify(process.env.API_BASE_URL),
          __X_APP_ID__: JSON.stringify(process.env.X_APP_ID),
          __X_APP_VERSION__: JSON.stringify(process.env.X_APP_VERSION),
          // __HOME_URL__: JSON.stringify(process.env.HOME_URL),
        },
        plugins: [
          tailwindcss(),
        ],
      },
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: "CBE Recipt Viwer",
      link: [],
    },
  },
  hooks: {
    "components:dirs": (dirs) => {
      dirs.unshift({
        path: "~/components/ui",
        // this is required else Nuxt will autoImport `.ts` file
        extensions: [".vue"],
        // prefix for your components, eg: UiButton
        prefix: "Ui",
        // prevent adding another prefix component by it's path.
        pathPrefix: false,
      });
    },
  },
  imports: {
    dirs: [
      // Scan top-level modules
      "composables",
      // ... or scan modules nested one level deep with a specific name and file extension
      "composables/*/index.{ts,js,mjs,mts}",
      // ... or scan all modules within given directory
      "composables/**",
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