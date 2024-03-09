<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :width="200"
    :breakpoint="599.99"
    bordered
  >
    <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
      <div class="lt-sm flex justify-center items-center">
        <q-avatar>
          <q-img src="/favicon.ico" fit="cover" />
        </q-avatar>
        <div class="text-h5">视觉</div>
      </div>

      <q-separator />
      
      <!-- 大屏导航 -->
      <q-list padding>
        <q-item
          class="gt-xs"
          clickable
          v-ripple
          v-for="(tabItem, i) in tabsMenu"
          :to="tabItem.to"
          :key="i"
        >
          <q-item-section avatar>
            <q-icon :name="tabItem.icon" />
          </q-item-section>
          <q-item-section>{{ tabItem.label }}</q-item-section>
        </q-item>

        <!-- 主题 -->
        <!-- 暗黑主题 -->
        <q-separator class="gt-xs" />

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="dark_mode" size="sm" class="q-mr-xs" />暗黑模式
            </q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle
              :disable="themeStore.themeAutoSys"
              @update:model-value="themeStore.setDark()"
              keep-color
              color="primary"
              dense
              v-model="themeStore.dark"
              icon="brightness_3"
              unchecked-icon="wb_sunny"
            />
          </q-item-section>
        </q-item>

        <!-- 主题色 -->
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="color_lens" size="sm" class="q-mr-xs" />主题色
            </q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-btn class="fit bg-primary" unelevated dense />
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-color
                v-model="themeStore.primaryColor"
                @update:model-value="
                  themeStore.setPrimaryColor(themeStore.primaryColor)
                "
                no-header-tabs
                default-view="palette"
                flat
                :default-value="themeStore.primaryColor"
                :palette="[
                  '#1976d2',
                  '#26a69a',
                  '#9c27b0',
                  '#31ccec',
                  '#f2c037',
                  '#21ba45',
                  '#e91e63',
                  '#3f51b5',
                  '#2196f3',
                  '#673ab7',
                  '#03a9f4',
                  '#009688',
                  '#ff5722',
                  '#795548',
                  '#C71585',
                  '#FF1493',
                  '#00FF00',
                  '#4A90E2',
                  '#2ECC71',
                  '#3B5998',
                  '#fbc2eb',
                  '#a2d4ec',
                  '#FF6F61',
                  '#FFCF48',
                  '#2F80ED',
                  '#1A535C',
                  '#FFC0CB',
                  '#008080',
                  '#FF0000',
                  '#FFC0CB',
                  '#FFB6C1',
                  '#FFA07A',
                  '#F08080',
                  '#2A9D8F',
                  '#2F4858',
                  '#FF00D2',
                  '#00A8E8',
                  '#f2a7a7',
                  '#f2f2a7',
                  '#a7f2a7',
                  '#a7f2a7',
                  '#a7a7f2',
                  '#7F00FF',
                  '#00D2FF',
                  '#FFB800',
                  '#FF4F00',
                  '#C71585',
                  '#FF69B4',
                  '#FF1493',
                  '#FFC0CB',
                ]"
              />
            </q-popup-proxy>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { inject, ref } from "vue";
import { theme } from "../stores/themeStore";

const themeStore = theme();

const tabsMenu = inject("tabsMenu");

const drawer = inject("drawer");
</script>

<style scoped lang="sass">
</style>
