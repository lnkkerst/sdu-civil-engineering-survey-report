import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/svg-material-icons'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import '~/styles/main.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

app.use(router)
app.use(Quasar, { plugins: {}, iconSet: quasarIconSet })
app.mount('#app')
