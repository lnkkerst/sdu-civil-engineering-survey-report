/// <reference types="vitest" />

import path from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Pages from 'vite-plugin-pages';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import {
  Vuetify3Resolver,
  NaiveUiResolver,
  ElementPlusResolver
} from 'unplugin-vue-components/resolvers';
import Unocss from 'unocss/vite';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  plugins: [
    Vue({
      reactivityTransform: true
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({}),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],
      dts: true,
      dirs: ['./src/composables'],
      vueTemplate: true
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      resolvers: [Vuetify3Resolver(), NaiveUiResolver(), ElementPlusResolver()]
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    vueJsx(),

    vuetify({ autoImport: false })
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom'
  }
});
