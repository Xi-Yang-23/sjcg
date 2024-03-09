<template>
  <q-page padding>
    <div style="padding-top: 50px">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>

    <!-- 首页顶部导航 -->
    <q-page-sticky expand position="top">
      <q-toolbar :class="themeStore.toolBarColor">
        <q-tabs active-color="primary">
          <q-route-tab
            v-for="(it, i) in homeTabs"
            :key="i + 'tbasHome'"
            :to="it.to"
            :label="it.label"
            exact
          />
        </q-tabs>
      </q-toolbar>
    </q-page-sticky>

    <!-- 返回顶部 -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :duration="20"
    >
      <q-btn fab-mini icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </q-page>
</template>

<script setup>
import { inject } from "vue";

const themeStore = inject("themeStore");
const homeTabs = [
  {
    to: "/home",
    label: "推荐",
  },

  {
    to: "/home/qd",
    label: "前端",
  },
  {
    to: "/home/hd",
    label: "后端",
  },

  {
    to: "/home/music",
    label: "音乐",
  },
];
</script>

<style scoped lang="sass">
.carousel:deep(.q-carousel__slide)
  padding: 0
</style>