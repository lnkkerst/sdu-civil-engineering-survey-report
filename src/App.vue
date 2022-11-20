<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()

const prefferDarkMode = useStorage<'auto' | boolean>(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-dark-mode',
  'auto',
  localStorage,
)
$q.dark.set(prefferDarkMode.value)
watch(
  () => $q.dark.mode,
  (newValue) => {
    prefferDarkMode.value = newValue
  },
)

const leftDrawerOpen = useStorage(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-left-drawer',
  false,
  localStorage,
)

const menuList = [
  {
    label: '闭合导线坐标计算表',
    route: '/bi-he-dao-xian-zuo-biao-ji-suan-biao',
  },
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
  <q-layout view="hHh LpR lFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> 工程测量实验 </q-toolbar-title>

        <q-btn flat round dense>
          <i i-mdi-theme-light-dark text-xl />
          <q-menu>
            <q-list>
              <q-item
                v-close-popup
                clickable
                :active="$q.dark.mode === 'auto'"
                @click="$q.dark.set('auto')"
              >
                <q-item-section>自动</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                :active="$q.dark.mode === false"
                @click="$q.dark.set(false)"
              >
                <q-item-section>亮</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                v-close-popup
                clickable
                :active="$q.dark.mode === true"
                @click="$q.dark.set(true)"
              >
                <q-item-section>暗</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list padding>
        <q-item
          v-ripple
          clickable
          :active="$route.path === '/'"
          @click="$router.push('/')"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section> 主页 </q-item-section>
        </q-item>

        <q-separator />

        <q-item
          v-for="item in menuList"
          :key="item.label"
          v-ripple
          clickable
          :active="$route.path === item.route"
          @click="$router.push(item.route)"
        >
          <q-item-section>
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div relative my="6" px="4">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
