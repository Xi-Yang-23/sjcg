音乐播放
```html
  <!-- 音乐播放器界面   -->
    <q-dialog
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="useMusicStore.musicDiaShowModel"
      maximized
      persistent
      v-if="useMusicStore.musicDiaShowModel"
    >
      <q-card
        class="text-white music-box overflow-hidden bg-black"
        flat
        :data-bg="useMusicStore.setMusicBg"
      >
        <!-- 顶部 -->
        <q-card-section class="q-py-none q-px-none">
          <q-toolbar>
            <q-toolbar-title class="text-body1 ellipsis">
              {{ useMusicStore.musicTitle }}
            </q-toolbar-title>
            <q-btn
              dense
              flat
              icon="r_close"
              v-close-popup
              @click="useMusicStore.musicDiaLogClose"
            />
          </q-toolbar>
        </q-card-section>

        <!-- 内容 -->
        <q-card-section
          :style="{ height: useMusicStore.progressCfg.contenHei }"
          class="q-pt-none"
        >
          <!-- <q-spinner-facebook
            color="white"
            size="md"
            v-if="useMusicStore.musicPlatBtnLoading"
            class="absolute-center"
          /> -->

          <q-avatar size="150px" class="absolute-center">
            <q-img
              :src="useMusicStore.musicLists[useMusicStore.activeIndex].img"
              :ratio="1"
              class="music-img-rotate"
              fit="cover"
              :class="
                useMusicStore.musicState
                  ? 'music-img-running'
                  : 'music-img-paused'
              "
            />
          </q-avatar>
          <canvas ref="musicVizCanvas"></canvas>
        </q-card-section>

        <!-- 底部操作栏 -->
        <q-card-actions
          align="around"
          :vertical="useMusicStore.progressCfg.vertical"
          class="q-pt-none no-wrap"
        >
          <!-- 功能 -->
          <div :class="useMusicStore.progressCfg.gonNengClass">
            <!-- 点赞 r_favorite r_favorite_border -->
            <q-btn flat icon="r_favorite" color="red" round />

            <!-- 添加到收藏 r_star_border r_star -->
            <q-btn flat icon="r_star_outline" round />

            <!-- 评论 -->
            <q-btn flat round>
              <q-icon name="o_mode_comment" size="xs" />
              <q-badge label="34" transparent color="blue" floating rounded />
            </q-btn>

            <!-- 可视化 -->
            <!-- <q-btn flat icon="r_insights" round /> -->
            <q-btn-dropdown
              icon="r_insights"
              dropdown-icon="r_arrow_drop_down"
              rounded
              flat
            >
              <q-list separator dense>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Photos</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Videos</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Articles</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>

          <!-- 进度条 -->
          <q-item class="no-padding">
            <q-item-section side>
              <span class="text-white">{{ useMusicStore.musicNowTime }}</span>
            </q-item-section>
            <q-item-section>
              <q-slider
                track-size="3px"
                track-color="grey-5"
                thumb-size="15px"
                selection-color="white"
                thumb-color="white"
                :min="0"
                :max="1"
                :step="0.001"
                :label-value="useMusicStore.slideSelectTime"
                label
                label-color="primary"
                :markers="0.5"
                :model-value="useMusicStore.musicProgress"
                @change="useMusicStore.progressMoudelUp"
                @update:model-value="useMusicStore.updateModel"
                :style="{ width: useMusicStore.progressCfg.proWid }"
              />
            </q-item-section>
            <q-item-section side>
              <span class="text-white">{{ useMusicStore.musicDuration }}</span>
            </q-item-section>
          </q-item>

          <!-- 播放相关 -->
          <div :class="useMusicStore.progressCfg.gonNengClass">
            <!--循环 r_repeat  | 单曲循环 r_repeat_one | 随机 r_shuffle-->
            <q-btn
              flat
              dense
              :icon="useMusicStore.playIconAndTxt.icon"
              @click="musicPlayTypeToggle"
              size="sm"
            />

            <!-- 上一首 -->
            <q-btn flat icon="r_skip_previous" round @click="playPreMusic" />

            <!-- r_pause 播放 :loading="useMusicStore.musicPlatBtnLoading" -->
            <q-btn
              flat
              round
              @click="toggleMuiscPlay"
              :icon="useMusicStore.playIcon"
            />

            <!-- 下一首 -->
            <q-btn flat icon="r_skip_next" round @click="playNextMusic" />

            <!-- 播放列表 -->
            <q-btn flat icon="r_queue_music" round>
              <q-menu
                style="width: 260px"
                transition-show="slide-left"
                transition-hide="slide-right"
              >
                <q-card class="col mini-heriz-bottom" square flat>
                  <q-card-actions align="between">
                    <div class="text-body1">
                      播放列表<span class="text-weight-medium"
                        >&nbsp;×&nbsp;{{
                          useMusicStore.musicLists.length
                        }}</span
                      >
                    </div>

                    <!-- 销毁音乐播放器 -->
                    <q-btn
                      flat
                      size="sm"
                      dense
                      icon="r_remove_circle_outline"
                      @click="useMusicStore.disMusicPlay"
                    />
                  </q-card-actions>
                </q-card>
                <q-scroll-area
                  style="height: 200px"
                  class="set-scroll-width"
                  :thumb-style="{ width: '5px' }"
                >
                  <q-list>
                    <!-- 音乐播放列表   -->
                    <q-item
                      class="no-padding row"
                      v-for="(it, i) in useMusicStore.musicLists"
                      :key="'musiclist-' + i"
                    >
                      <q-item
                        clickable
                        class="col q-pr-none"
                        :active="i === useMusicStore.activeIndex"
                        @click="useMusicStore.musicMenuListPlay(i)"
                      >
                        <q-item-section side>
                          <q-item-label>
                            {{ i + 1 }}
                          </q-item-label>
                        </q-item-section>

                        <q-item-section class="q-pr-sm text-body1">
                          <q-item-label :lines="1">
                            {{ it.title }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <!-- 删除歌曲 -->
                      <q-item-section class="col-2">
                        <q-btn
                          stack
                          flat
                          color="grey"
                          size="sm"
                          padding="none"
                          stretch
                          class="full-height"
                          icon="r_delete_outline"
                          align="center"
                          @click="useMusicStore.delMusic(i)"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </q-menu>
            </q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 音乐迷你播放器 -->
    <transition
      appear
      enter-active-class="animated zoomInDown slow"
      leave-active-class="animated zoomOutLeft slow"
    >
      <q-page-sticky
        :position="useMusicStore.musicSize.pos"
        v-if="useMusicStore.miniMusicPlayShow"
      >
        <q-card
          :style="{ width: useMusicStore.musicSize.musicMiniWidthStyle }"
          :class="useMusicStore.musicSize.musicMiniWidthClass"
          square
        >
          <q-linear-progress
            :value="useMusicStore.musicProgress"
            color="primary"
            :size="useMusicStore.musicSize.progressSize"
            instant-feedback
            :indeterminate="useMusicStore.musicPlatBtnLoading"
          />

          <q-card-section
            class="items-center no-wrap q-py-sm non-selectable"
            :class="useMusicStore.musicSize.miniPad"
          >
            <q-tab-panels
              @transition="useMusicStore.miniSwipeEv"
              v-model="useMusicStore.currPlayIndex"
              :animated="useMusicStore.miniSwipeAn"
              :swipeable="!useMusicStore.musicSize.miniShowNextPreBtn"
              infinite
              class="col-xs-9 col-sm-7 col-md-7 col-lg-7 col-xl-7"
            >
              <q-tab-panel
                :name="i"
                class="no-padding row"
                :class="useMusicStore.musicSize.miniCurStyle"
                v-for="(it, i) in useMusicStore.miniPlayRenderData"
                :key="'mn-clist-' + it"
                @click="useMusicStore.musicDiaShowModel = true"
              >
                <div class="col-2 overflow-hidden">
                  <q-avatar
                    size="md"
                    class="music-img-rotate"
                    :class="
                      useMusicStore.musicState
                        ? 'music-img-running'
                        : 'music-img-paused'
                    "
                  >
                    <q-img :src="useMusicStore.musicLists[it].img" :ratio="1">
                      <template #loading>
                        <q-spinner-bars color="primary" size="xs" />
                      </template>
                    </q-img>
                  </q-avatar>
                </div>

                <div class="col">
                  <q-item-label
                    :lines="1"
                    class="text-body1 text-weight-medium"
                  >
                    {{ useMusicStore.musicLists[it].title }}
                  </q-item-label>

                  <q-item-label :lines="1" caption class="text-grey">
                    {{ useMusicStore.musicLists[it].author }}
                  </q-item-label>
                </div>
              </q-tab-panel>
            </q-tab-panels>
            <q-card-actions align="between" class="col q-py-none no-wrap">
              <!-- 上一首 -->
              <q-btn
                flat
                icon="r_skip_previous"
                round
                @click="playPreMusic"
                v-if="useMusicStore.musicSize.miniShowNextPreBtn"
              />

              <!-- r_pause 播放 :loading="useMusicStore.musicPlatBtnLoading" -->
              <q-btn
                flat
                round
                @click="toggleMuiscPlay"
                :icon="useMusicStore.playIcon"
              />

              <!-- 下一首 -->
              <q-btn
                flat
                v-if="useMusicStore.musicSize.miniShowNextPreBtn"
                icon="r_skip_next"
                round
                @click="playNextMusic"
              />

              <q-separator
                vertical
                inset
                v-if="useMusicStore.musicSize.miniShowNextPreBtn"
              />
              <!-- 播放列表 -->
              <q-btn flat round icon="r_queue_music" dense>
                <q-menu
                  style="width: 260px"
                  transition-show="slide-left"
                  transition-hide="slide-right"
                >
                  <q-card class="col mini-heriz-bottom" square flat>
                    <q-card-section class="q-pb-none">
                      <div class="text-body1">
                        播放列表<span class="text-weight-medium"
                          >&nbsp;×&nbsp;{{
                            useMusicStore.musicLists.length
                          }}</span
                        >
                      </div>
                    </q-card-section>
                    <q-card-actions align="between">
                      <!-- 销毁音乐播放器 -->
                      <q-btn
                        flat
                        dense
                        icon="r_remove_circle_outline"
                        @click="useMusicStore.disMusicPlay"
                      />

                      <!-- r_repeat_one 单曲循环 |r_repeat 顺序 | 随机 r_shuffle-->
                      <q-btn
                        flat
                        dense
                        :icon="useMusicStore.playIconAndTxt.icon"
                        :label="useMusicStore.playIconAndTxt.label"
                        @click="musicPlayTypeToggle"
                      />
                    </q-card-actions>
                  </q-card>
                  <q-scroll-area
                    style="height: 200px"
                    class="set-scroll-width"
                    :thumb-style="{ width: '5px' }"
                  >
                    <q-list>
                      <!-- 音乐播放列表   -->
                      <q-item
                        class="no-padding row"
                        v-for="(it, i) in useMusicStore.musicLists"
                        :key="'musiclist-' + i"
                      >
                        <q-item
                          clickable
                          class="col q-pr-none"
                          :active="i === useMusicStore.activeIndex"
                          @click="useMusicStore.musicMenuListPlay(i)"
                        >
                          <q-item-section side>
                            <q-item-label>
                              {{ i + 1 }}
                            </q-item-label>
                          </q-item-section>

                          <q-item-section class="q-pr-sm text-body1">
                            <q-item-label :lines="1">
                              {{ it.title }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <!-- 删除歌曲 -->
                        <q-item-section class="col-2">
                          <q-btn
                            stack
                            flat
                            color="grey"
                            size="sm"
                            padding="none"
                            stretch
                            class="full-height"
                            icon="r_delete_outline"
                            align="center"
                            @click="useMusicStore.delMusic(i)"
                          />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </q-menu>
              </q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-page-sticky>
    </transition>
```