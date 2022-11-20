<script setup lang="ts">
const leftDrawerOpen = useStorage(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-left-drawer',
  false,
  localStorage
);

const menuList = [
  {
    label: '闭合导线坐标计算表',
    route: '/bi-he-dao-xian-zuo-biao-ji-suan-biao'
  }
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
<template>
  <q-layout view="hHh LpR lFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> 工程测量实验 </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list padding>
        <q-item
          clickable
          v-ripple
          :active="$route.path === '/'"
          @click="$router.push('/')"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section> 主页 </q-item-section>
        </q-item>

        <q-separator></q-separator>

        <q-item
          v-for="item in menuList"
          clickable
          v-ripple
          :active="$route.path === item.route"
          @click="$router.push(item.route)"
          :key="item.label"
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
