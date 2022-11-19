<script setup lang="ts">
let drawer = $ref(false);
</script>
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer"> </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <div relative px="sm" pt="xl">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped></style>
