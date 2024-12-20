// import './assets/main.css'

import { Quasar, Dark, Notify, Dialog } from 'quasar'
import 'vue-multiselect/dist/vue-multiselect.css'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Quasar, {
    plugins: {
        Notify,
        Dialog,
        Dark,
    }, // import Quasar plugins and add here
    config: {
        dark: "auto"
    }
})

app.use(createPinia())
app.use(router)

app.mount('#app')
