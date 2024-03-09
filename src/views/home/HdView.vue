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
      transition="scale"
      v-for="(it, i) in loadStart.data.value"
      :key="i + 'list-card'"
      :class="'q-mb-' + gapSize.name"
    >
      <q-item clickable v-ripple>
        <!-- 贴子内容+标题 -->
        <q-item-section>
          <q-item-label class="text-body1 text-weight-medium" :lines="2">
            <span> {{ it.title }} </span>
          </q-item-label>

          <q-item-label :lines="3" class="text-body2 q-pt-sm">
            {{ it.content }}
          </q-item-label>
        </q-item-section>

        <!-- 贴子封面 -->
        <q-item-section avatar>
          <q-img
            :src="it.img"
            width="100px"
            :ratio="4 / 3"
            class="rounded-borders"
          >
            <template v-slot:loading>
              <q-spinner-gears size="md" color="primary" />
            </template>
          </q-img>
        </q-item-section>
      </q-item>

      <!-- 贴子信息-->
      <div class="flex justify-between text-grey q-px-md">
        <!-- 发布者 -->
        <div class="flex q-gutter-x-sm items-center">
          <q-btn
            flat
            :align="'left'"
            class="text-weight-regular"
            no-caps
            padding="none"
          >
            <span class="ellipsis">
              <!-- 作者头像 -->
              <q-avatar size="sm">
                <q-img :src="it.avatar">
                  <template v-slot:loading>
                    <q-spinner-ball color="primary" size="xs" />
                  </template>
                </q-img>
              </q-avatar>
              <span class="q-ml-xs"> {{ it.author }} </span>
            </span>
          </q-btn>
          <span><q-icon name="favorite_border" /> {{ it.likes }} </span>
          <span><q-icon name="o_remove_red_eye" /> {{ it.see }} </span>
        </div>
        <!-- 更多 -->
        <q-btn class="flex-end" flat icon="more_horiz" no-caps size="sm" />
      </div>
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
  inject,
  onBeforeMount,
  onActivated,
  onDeactivated,
  nextTick,
} from "vue";

import { onBeforeRouteLeave } from "vue-router";
import axios from "axios";
import load from "../../common/infiniteScroll.js";

const loadStart = load("/home/qd");
const scrollPos = loadStart.scrollPos();

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
  const listsData = await axios.get("/home/qd");

  loadStart.data.value = listsData.data.lists;
});

const gapSize = inject("gapSize");
</script>

<style scoped lang="sass">
</style>
