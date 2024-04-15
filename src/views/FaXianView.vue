<template>
  <q-page>
    <!--  顶部导航 -->
    <q-page-sticky
      position="top"
      expand
      :class="themeStore.toolBarColor"
      class="z-1"
    >
      <q-toolbar>
        <q-tabs
          active-color="primary"
          v-model="activeTabs"
          @update:model-value="toggleTabs"
        >
          <q-tab
            :key="i + 'tabs'"
            :name="it.name"
            :label="it.label"
            v-for="(it, i) in faXianTabs"
          />
        </q-tabs>
      </q-toolbar>
    </q-page-sticky>

    <q-infinite-scroll
      v-scroll="dbScroll"
      ref="infiniteScroll"
      @load="loadData"
      :offset="100"
      class="q-pt-xl"
    >
      <q-tab-panels v-model="activeTabs">
        <q-tab-panel
          :name="activeTabs"
          :class="useScreenStore.contentPad"
          v-if="renderData.length"
        >
          <!--  音乐 -->
          <div v-if="activeTabs === 'music'">
            <q-list separator>
              <q-item
                ref="anBoxEl"
                class="row no-padding"
                v-for="(it, i) in renderData"
                :key="'music' + i"
                :active="it.id === useMusicStore.currPlayId"
              >
                <q-item
                  v-ripple:primary
                  clickable
                  class="col q-pr-none"
                  @click="musicItemClick(it, i)"
                >
                  <q-item-section top avatar>
                    <q-avatar rounded>
                      <!-- 音乐播放动画 -->
                      <div
                        class="fit flex justify-center items-center"
                        v-if="it.id === useMusicStore.currPlayId"
                      >
                        <music-play-animate :state="useMusicStore.musicState" />
                      </div>

                      <q-img :src="it.img" :ratio="1" v-else>
                        <template v-slot:loading>
                          <q-spinner-puff size="sm" color="primary" />
                        </template>
                      </q-img>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="q-pr-sm">
                    <q-item-label
                      :lines="1"
                      :class="useScreenStore.contentFontSize"
                    >
                      {{ it.title }}
                    </q-item-label>
                    <q-item-label caption :lines="1">
                      <span class="text-weight-medium">{{ it.musicTime }}</span>

                      <span class="q-pl-sm">
                        <q-icon name="headset" />&nbsp;{{ it.listen }}
                      </span>

                      <span class="float-right">{{ it.author }}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item-section class="no-padding col-1">
                  <q-btn
                    color="grey"
                    stack
                    flat
                    size="sm"
                    padding="none"
                    stretch
                    class="full-height"
                    icon="more_vert"
                    align="center"
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
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div v-else>
            <q-card
              v-for="(it, i) in renderData"
              :key="i + 'list-card'"
              flat
              ref="anBoxEl"
            >
              <q-card-section
                horizontal
                v-ripple:primary
                class="cursor-pointer"
              >
                <q-card-section class="flex flex-center q-pb-xs">
                  <q-img
                    :src="it.img"
                    class="rounded-borders"
                    :width="useScreenStore.cardImgSize.w"
                    :height="useScreenStore.cardImgSize.h"
                  >
                    <template #loading>
                      <q-spinner-cube color="primary" size="xs" />
                    </template>
                  </q-img>
                </q-card-section>

                <q-card-section class="q-pl-none q-pb-xs">
                  <q-item-label
                    :class="useScreenStore.contentFontSize"
                    :lines="2"
                    >{{ it.title }}
                  </q-item-label>
                  <q-item-label class="text-body2 q-pt-sm" :lines="3"
                    >{{ it.content }}
                  </q-item-label>
                </q-card-section>
              </q-card-section>

              <q-card-actions class="text-caption text-grey">
                <!-- 昵称 -->
                <div
                  v-ripple
                  :class="useScreenStore.cardAxctionPad"
                  class="flex col-4 no-wrap items-center cursor-pointer relative-position"
                >
                  <q-avatar size="sm">
                    <q-img :src="it.avatar" spinner-color="primary" :ratio="1">
                      <template #loading>
                        <q-spinner-puff color="primary" size="xs" />
                      </template>
                    </q-img>
                  </q-avatar>

                  <q-item-label :lines="1" class="q-ml-sm">
                    {{ it.uName }}
                  </q-item-label>
                </div>
                <q-space />

                <!-- 发布日期 -->
                <q-item-label class="flex items-center q-mr-md q-mt-xs">
                  <q-icon name="o_access_time" />&nbsp;{{ it.date }}
                </q-item-label>

                <!-- 浏览 -->
                <q-item-label class="flex items-center q-mr-md"
                  ><q-icon name="o_remove_red_eye" />&nbsp;{{ it.likes }}
                </q-item-label>

                <!-- 评论 -->
                <!-- <q-item-label class="flex items-center q-mr-sm"
                  ><q-icon name="o_mode_comment" />&nbsp;{{
                    it.see
                  }}</q-item-label
                > -->

                <q-btn
                  color="grey"
                  flat
                  class="q-mt-xs"
                  size="sm"
                  icon="r_more_horiz"
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
              </q-card-actions>
            </q-card>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <template v-slot:loading>
        <div class="row justify-center items-center q-my-md">
          <q-spinner-cube color="primary" size="sm" />
        </div>
      </template>
    </q-infinite-scroll>

    <!-- 返回顶部 -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[25, 50]"
    >
      <q-btn
        :fab="Screen.gt.xs"
        :fab-mini="Screen.xs"
        icon="o_flight"
        color="primary"
      />
    </q-page-scroller>
  </q-page>
</template>
  
<script setup>
import { inject, onMounted } from "vue";
import screenSizeCfgStore from "../stores/screenSizeCfgStore";
import faXianTabs, {
  activeTabs,
  music,
  loadData,
  tuiJian,
  renderData,
  toggleTabs,
  infiniteScroll,
  anBoxEl,
  dbScroll,
  activeMusicItemIndex,
  musicItemClick,
} from "../common/faXian";
import { Screen } from "quasar";
import MusicPlayAnimate from "../components/music/MusicPlayAnimate.vue";
import gloabStore from "../stores/starUpGxStrore";
import musicStore from "../stores/musicStore";
const useMusicStore = musicStore();
const useGloabStore = gloabStore();
const useScreenStore = screenSizeCfgStore();

const themeStore = inject("themeStore");
</script>
  
<style scoped lang="sass">
.z-1
  z-index: 1
</style>