<template>
  <q-page padding>
    <!-- 轮播  -->
    <q-responsive :ratio="16 / 9" style="max-width: 600px">
      <!-- 轮播骨架 -->
      <q-skeleton :animation-speed="600" v-if="!carousel" />

      <q-carousel
        v-else
        animated
        v-model="slide"
        :transition-duration="500"
        :autoplay="carousel.length > 1 ? 3000 : 0"
        :infinite="carousel.length > 1"
        swipeable
        :arrows="!$q.platform.has.touch && carousel.length > 1"
        :navigation="carousel.length > 1"
        transition-prev="scale"
        transition-next="scale"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
        class="carousel rounded-borders"
      >
        <template v-slot:navigation-icon="{ active, onClick }">
          <q-btn flat size="sm" v-if="active" @click="onClick" :ripple="false">
            <div
              class="caruse-progress carouse-progress-active relative-position"
            ></div>
          </q-btn>

          <q-btn flat size="sm" v-else @click="onClick" :ripple="false">
            <div class="caruse-progress relative-position"></div>
          </q-btn>
        </template>

        <q-carousel-slide
          v-for="(slideItem, slideI) in carousel"
          :key="slideI"
          :name="slideI + 1"
          class="cursor-pointer"
        >
          <q-img :src="slideItem.src" class="fit" loading="eager">
            <template v-slot:loading>
              <q-spinner-ball color="primary" />
            </template>
          </q-img>

          <div
            class="absolute-bottom text-body1 text-left ellipsis text-white q-px-sm bg-ts-dark"
            v-if="slideItem.hasTitle"
          >
            {{ slideItem.caption }}
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-responsive>

    <!-- 首页数据 + 滚动加载  -->
    <div :style="{ marginTop: gapSize.pix }" ref="tuiJianScrollEl">
      <q-infinite-scroll
        :disable="loadStart.disable.value"
        @load="loadStart.infiniteLoad"
        scroll-target=".scroll"
        v-if="loadStart.data.value"
      >
        <water-layout
          :cls="waterLayoutColumns"
          :gap="gapSize.num"
          an="ease-in-out .5s"
        >
          <div
            v-for="(homeListItem, homeListItemIndex) in loadStart.data.value"
            :key="'home-card-' + homeListItemIndex"
          >
            <!-- 视频卡片  -->
            <q-card flat v-if="homeListItem.type === 0">
              <q-item
                clickable
                class="column no-padding card"
                v-ripple="{ color: 'primary' }"
                to="/video"
              >
                <div class="relative-position rounded-borders overflow-hidden">
                  <q-responsive :ratio="9 / 16" class="card-img-max-height">
                    <!-- 视频封面 -->
                    <q-img :src="homeListItem.src">
                      <template v-slot:loading>
                        <q-spinner-ball color="primary" size="md" />
                      </template>
                    </q-img>
                  </q-responsive>

                  <div
                    class="absolute-bottom text-caption text-center row justify-between q-pa-sm text-white lgr-tb"
                  >
                    <!-- 浏览量 -->
                    <div>
                      <q-icon size="xs" name="o_remove_red_eye" />
                      {{ homeListItem.see }}
                    </div>

                    <!-- 时间 -->
                    <div>{{ homeListItem.videoTime }}</div>
                  </div>
                </div>

                <!-- 视频信息 -->
                <span
                  class="ellipsis-3-lines text-body1 q-pt-sm q-pl-sm q-pr-sm"
                >
                  <!-- <q-badge color="green" label="新" class="q-mr-xs" />
                    <q-badge color="orange" label="精" class="q-mr-xs" /> -->
                  {{ homeListItem.title }}
                </span>
              </q-item>

              <!-- 标签 -->
              <div
                class="row q-gutter-xs q-pl-sm q-pt-sm q-pr-sm"
                v-if="homeListItem.tags.length"
              >
                <q-chip
                  square
                  dense
                  size="sm"
                  clickable
                  v-for="t in homeListItem.tags"
                >
                  #{{ t }}
                </q-chip>
              </div>

              <!-- 发布者 -->
              <div class="row text-grey justify-start">
                <q-btn
                  flat
                  align="left"
                  class="col-10 text-weight-regular"
                  no-caps
                  padding="xs none sm sm"
                >
                  <span class="ellipsis">
                    <q-avatar size="sm">
                      <q-img :src="homeListItem.avatar" :ratio="1">
                        <template v-slot:loading>
                          <q-spinner-ball color="primary" size="xs" />
                        </template>
                      </q-img>
                    </q-avatar>
                    <span
                      :class="{ 'user-gf-1': homeListItem.gf }"
                      class="q-ml-xs"
                    >
                      {{ homeListItem.author }}
                    </span>
                  </span>
                </q-btn>
                <q-space />
                <q-btn
                  class="col-2"
                  flat
                  icon="more_horiz"
                  no-caps
                  size="sm"
                  padding="none"
                >
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="useGloabStore.setDialog(1)"
                      >
                        <q-item-section side>
                          <q-icon name="r_star_border" size="sm" />
                        </q-item-section>
                        <q-item-section> 收藏 </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card>

            <!-- 贴子卡片 -->
            <q-card flat v-else-if="homeListItem.type === 1">
              <q-item
                clickable
                class="column no-padding card"
                v-ripple="{ color: 'primary' }"
              >
                <!-- 贴子封面 -->
                <q-img
                  :src="homeListItem.srcs[0]"
                  v-if="homeListItem.srcs.length"
                  :ratio="4 / 3"
                  class="card-img-max-height rounded-borders q-mb-sm"
                >
                  <template v-slot:loading>
                    <q-spinner-ball color="primary" size="md" />
                  </template>
                </q-img>

                <!-- 贴子标题+内容 -->
                <div class="text-body1 ellipsis-2-lines q-pl-sm q-pr-sm">
                  <!-- <q-badge color="green" label="新" class="q-mr-xs" />
                    <q-badge color="orange" label="精" class="q-mr-xs" /> -->
                  {{ homeListItem.title }}
                </div>

                <div class="text-body2 ellipsis-3-lines q-pt-md q-px-sm">
                  {{ homeListItem.content }}
                </div>

                <!-- 浏览量 -->
                <div
                  class="text-caption text-center row justify-between q-px-sm q-pt-sm text-grey"
                >
                  <div>
                    <q-icon size="xs" name="o_remove_red_eye" />
                    {{ homeListItem.see }}
                  </div>

                  <!-- 点赞 -->
                  <div>
                    <q-icon size="xs" name="favorite_border" />
                    {{ homeListItem.likes }}
                  </div>
                </div>
              </q-item>

              <!-- 标签 -->
              <div class="row q-gutter-xs q-px-sm q-pt-sm">
                <q-chip
                  square
                  dense
                  size="sm"
                  clickable
                  v-for="t in homeListItem.tags"
                >
                  #{{ t }}
                </q-chip>
              </div>

              <!-- 发布者 -->
              <div class="row text-grey">
                <q-btn
                  flat
                  align="left"
                  class="col-10 text-weight-regular"
                  no-caps
                  padding="xs none sm sm"
                >
                  <span class="ellipsis">
                    <q-avatar size="sm">
                      <q-img :src="homeListItem.avatar" :ratio="1">
                        <template v-slot:loading>
                          <q-spinner-ball color="primary" size="xs" />
                        </template>
                      </q-img>
                    </q-avatar>
                    <span
                      :class="{ 'user-gf-1': homeListItem.gf }"
                      class="q-ml-xs"
                      >{{ homeListItem.author }}</span
                    >
                  </span>
                </q-btn>

                <q-btn
                  class="col-2"
                  flat
                  icon="more_horiz"
                  no-caps
                  size="sm"
                  padding="none"
                  color="grey"
                >
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="useGloabStore.setDialog(1)"
                      >
                        <q-item-section side>
                          <q-icon name="r_star_border" size="sm" />
                        </q-item-section>
                        <q-item-section> 收藏 </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card>

            <!-- 音乐卡片 -->
            <q-card flat v-else>
              <q-item
                clickable
                class="column no-padding"
                v-ripple="{ color: 'primary' }"
                @click="musicItemClick(homeListItem, homeListItemIndex)"
              >
                <q-item-section
                  class="relative-position rounded-borders overflow-hidden text-white"
                >
                  <!--   音乐封面 -->
                  <q-img :src="homeListItem.img" :ratio="1">
                    <template v-slot:loading>
                      <q-spinner-ball color="primary" size="md" />
                    </template>
                  </q-img>

                  <!-- 音乐标题 -->
                  <q-item-label
                    class="text-body1 absolute-top q-px-sm q-pt-xs lgr-tt"
                    :lines="3"
                  >
                    {{ homeListItem.title }}
                  </q-item-label>

                  <!-- 播放次数+歌曲播放状态 -->
                  <div
                    class="absolute-bottom text-caption row q-pa-sm bg-ts-dark"
                  >
                    <!-- 歌曲播放状态 -->
                    <music-play-animate
                      :state="useMusicStore.musicState"
                      v-if="homeListItem.id === useMusicStore.currPlayId"
                    />

                    <!-- 播放次数 -->
                    <div class="q-mr-sm" v-else>
                      <q-icon size="xs" name="o_headset" />
                      {{ homeListItem.listen }}
                    </div>
                    <q-space />

                    <span>{{ homeListItem.musicTime }}</span>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 标签 -->
              <div
                class="row q-gutter-xs q-px-sm q-pt-sm"
                v-if="homeListItem.tags.length"
              >
                <q-chip
                  square
                  dense
                  size="sm"
                  clickable
                  v-for="t in homeListItem.tags"
                >
                  #{{ t }}
                </q-chip>
              </div>

              <!-- 发布者 -->
              <div class="row text-grey">
                <q-btn
                  :align="'left'"
                  flat
                  class="col-10 text-weight-regular"
                  no-caps
                  padding="xs none sm sm"
                >
                  <span class="ellipsis">
                    <q-avatar size="sm">
                      <q-img :src="homeListItem.avatar" :ratio="1">
                        <template v-slot:loading>
                          <q-spinner-ball color="primary" size="xs" />
                        </template>
                      </q-img>
                    </q-avatar>
                    <span
                      :class="{ 'user-gf-1': homeListItem.gf }"
                      class="q-ml-xs"
                    >
                      {{ homeListItem.author }}
                    </span>
                  </span>
                </q-btn>
                <q-btn
                  class="col-2"
                  flat
                  icon="more_horiz"
                  no-caps
                  size="sm"
                  padding="none"
                >
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="useMusicStore.musicNextPlay(it)"
                      >
                        <q-item-section side
                          ><q-icon name="r_play_circle_outline"
                        /></q-item-section>
                        <q-item-section>下一首播放</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="useGloabStore.setDialog(1)"
                      >
                        <q-item-section side>
                          <q-icon name="r_star_border" size="sm" />
                        </q-item-section>
                        <q-item-section> 收藏 </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card>
          </div>
        </water-layout>

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
    </div>

    <!-- 歌曲操作对话框 -->
    <q-dialog v-model="musicDialog" position="bottom">
      <q-card class="shadow-up-4 q-pa-sm fit">
        <q-list>
          <!-- 歌曲封面+信息 -->
          <q-item class="q-py-none q-pb-sm">
            <q-item-section avatar class="q-pr-none">
              <q-img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
                class="rounded-borders"
                ratio="1"
              >
                <template v-slot:loading>
                  <q-spinner-ball color="primary" size="md" />
                </template>
              </q-img>
            </q-item-section>
            <q-item-section class="q-pl-md">
              <p class="text-left q-mb-xs text-body2">
                【奥迪】rs奥迪rs奥迪rrs奥迪rs奥迪rRR2323232【奥迪】rs奥迪rs奥迪rrs奥迪rs奥迪rRR2323232【奥迪】rs奥迪rs奥迪rrs奥迪rs奥迪rRR2323232YYYYYYYYY
              </p>

              <div class="col ellipsis text-caption text-grey full-width">
                夕阳qq无限好的夕阳无限好的
              </div>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple="{ color: 'purple' }">
            <q-item-section avatar>
              <q-icon name="library_music" color="purple" />
            </q-item-section>
            <q-item-section>收藏到歌单</q-item-section>
          </q-item>

          <q-item clickable v-ripple="{ color: 'teal' }">
            <q-item-section avatar>
              <q-icon name="skip_next" color="teal" />
            </q-item-section>
            <q-item-section>下一首播放</q-item-section>
          </q-item>

          <q-item clickable v-ripple="{ color: 'orange' }">
            <q-item-section avatar>
              <q-icon name="playlist_add" color="orange" />
            </q-item-section>
            <q-item-section>添加到播放列表</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple="{ color: 'blue' }">
            <q-item-section avatar>
              <q-icon name="share" color="blue" />
            </q-item-section>
            <q-item-section>分享</q-item-section>
          </q-item>

          <q-item clickable v-ripple="{ color: 'red' }">
            <q-item-section avatar>
              <q-icon name="do_not_disturb_alt" color="red" />
            </q-item-section>
            <q-item-section>不感兴趣</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>

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
import {
  inject,
  nextTick,
  onActivated,
  onBeforeMount,
  onDeactivated,
  ref,
  watchEffect,
} from "vue";

import { carouselStyle, slide } from "../common/home";
import MusicPlayAnimate from "../components/music/MusicPlayAnimate.vue";
import WaterLayout from "../components/WaterLayout.vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { onBeforeRouteLeave } from "vue-router";

import load from "../common/infiniteScroll.js";
import home from "../api/home";
import gloabStore from "../stores/starUpGxStrore";
import musicStore from "../stores/musicStore";
import { musicItemClick } from "../common/faXian";

const useMusicStore = musicStore();
const useGloabStore = gloabStore();

const loadStart = load("/home");
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

const $q = useQuasar();
let carousel = ref(null);

const waterLayoutColumns = ref(2);
watchEffect(() => {
  // 列数
  if ($q.screen.lt.md) {
    waterLayoutColumns.value = 2;
  } else if ($q.screen.md) {
    waterLayoutColumns.value = 3;
  } else {
    waterLayoutColumns.value = 4;
  }
});

onBeforeMount(async () => {
  // console.log(await home());
  // console.log(await axios.get("/api/home"));
  const home = await axios.get("/home");
  const lunBo = await axios.get("/lunbo");

  loadStart.data.value = home.data.lists;
  carousel.value = lunBo.data.carousel;
});

const musicDialog = ref(false);

const gapSize = inject("gapSize");

const themeStore = inject("themeStore");
</script>

<style scoped lang="sass">
@import url('@/assets/styles/carousel.sass')
</style>