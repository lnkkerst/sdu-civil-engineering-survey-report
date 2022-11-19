import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from 'virtual:generated-pages';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import App from './App.vue';

import '@unocss/reset/tailwind.css';
import 'uno.css';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
app.use(router);
app.use(
  createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    }
  })
);
app.mount('#app');
