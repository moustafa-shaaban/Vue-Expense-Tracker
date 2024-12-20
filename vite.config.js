import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
<<<<<<< HEAD

    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
=======
      
    })
  ],
  base: '/Vue-Expense-Tracker/',
>>>>>>> b552dd838d875ce9704360c9398e2fcbdb4a95ed
})
