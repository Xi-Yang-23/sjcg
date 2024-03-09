<template>
  <q-infinite-scroll
    :disable="loadStart.disable.value"
    @load="loadStart.infiniteLoad"
    scroll-target=".scroll"
    v-if="loadStart.data.value"
  >
    <!-- 列表 -->

    <q-card
      flat
      v-for="(it, i) in loadStart.data.value"
      :key="i + 'list-card'"
      :class="'q-mb-' + srSiezName.name"
      class="row"
    >
      <q-item
        clickable
        v-ripple
        :active="activeMusicIndex === i"
        @click="musicListCk(i, it)"
        class="col-10 q-pr-none"
      >
        <q-item-section avatar>
          <q-avatar rounded>
            <q-img :src="it.img" :ratio="1" v-show="activeMusicIndex !== i">
              <template v-slot:loading>
                <q-spinner-facebook size="sm" color="primary" />
              </template>
            </q-img>

            <div class="fit flex justify-center items-center">
              <music-play-animate
                v-show="activeMusicIndex === i"
                :state="musicState"
              />
            </div>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label :lines="1">{{ it.title }}</q-item-label>

          <q-item-label :lines="1" caption>
            <q-badge
              transparent
              :label="it.musicTime"
              color="primary"
              class="q-mr-sm"
            />
            {{ it.author }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-btn class="col-2 q-pl-none" flat color="grey" icon="tmore_vert" />
    </q-card>

    <template v-slot:loading>
      <div class="row justify-center q-my-sm text-grey items-center">
        <q-spinner-hourglass color="primary" size="md" />
        <span>加载中...</span>
      </div>
    </template>

    <!-- 滚动结束 -->
    <div
      class="row justify-center q-my-md items-center q-gutter-x-md"
      v-if="loadStart.dataLoadFinish.value"
    >
      <q-separator class="col" />
      <div class="col-auto text-grey">哎呀，到底儿了~</div>
      <q-separator class="col" />
    </div>
  </q-infinite-scroll>

  <!-- 首次加载 -->
  <q-inner-loading :showing="!loadStart.data.value" class="text-grey">
    <q-spinner-hourglass size="xl" color="primary" />加载中...
  </q-inner-loading>
</template>

<script setup>
import {
  onBeforeMount,
  onActivated,
  onDeactivated,
  nextTick,
  inject,
  ref,
} from "vue";

import { onBeforeRouteLeave } from "vue-router";
import axios from "axios";
import load from "../../common/infiniteScroll.js";

import MusicPlayAnimate from "../../components/music/MusicPlayAnimate.vue";

const loadStart = load("/home/music");
const scrollPos = loadStart.scrollPos();

const musicState = ref(true);
const activeMusicIndex = ref(-1);
const musicListCk = (i, it) => {
  if (i === activeMusicIndex.value) {
    musicState.value = !musicState.value;
  } else {
    musicState.value = true;
  }

  activeMusicIndex.value = i;
};

// 离开路由时记录滚动高度
onBeforeRouteLeave((to, from) => {
  // 获取滚动位置。
  scrollPos();
});

onActivated(async () => {
  await nextTick();
  loadStart.disable.value = false;
  // 设置滚动位置。
  scrollPos(true);
});

onDeactivated(() => {
  loadStart.disable.value = true;
});

onBeforeMount(async () => {
  const listsData = await axios.get("/home/music");
  loadStart.data.value = listsData.data.lists;
});

const srSiezName = inject("gapSize");
</script>

<style scoped lang="sass">
</style>
