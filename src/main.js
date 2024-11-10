// import './assets/main.css'

import { Quasar, Dark, Notify, Dialog } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

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
    } // import Quasar plugins and add here
})

app.use(createPinia())
app.use(router)

app.mount('#app')
