<template>
  <!-- hHh Lpr lff -->
  <q-layout view="lHr Lpr lFr" container class="window-height">
    <q-header
      reveal
      :class="themeStore.toolBarColor"
      v-show="useLayOutStateStore.homeHeader"
    >
      <q-toolbar>
        <q-btn
          :color="useLayOutStateStore.dreaws ? 'primary' : ''"
          flat
          @click="useLayOutStateStore.dreawsToggle"
          round
          icon="menu"
          class="lt-sm"
        />

        <!-- 大屏显示Logo -->
        <q-toolbar-title class="gt-xs">
          <q-avatar>
            <q-img src="/favicon.ico" fit="cover" />
          </q-avatar>
          视觉
        </q-toolbar-title>

        <q-space />

        <!-- 大屏显示搜索 -->
        <q-input
          standout
          outlined
          :loading="false"
          type="search"
          :placeholder="placeholderText"
          name="search"
          dense
          class="col-4 gt-xs q-mr-lg"
          clearable
          v-model="searchText"
        >
          <template v-slot:append>
            <q-btn icon="search" flat />
          </template>
        </q-input>

        <!-- 小屏显示搜索 -->
        <q-field
          outlined
          dense
          class="lt-sm q-mr-sm"
          style="max-width: calc(100vw - 204px)"
        >
          <template v-slot:control>
            <span class="text-grey-7 ellipsis">
              {{ placeholderText }}
            </span>
          </template>

          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-field>

        <div class="q-gutter-x-sm" v-if="useUserInfo.userName">
          <!-- 头像-->
          <q-btn flat round class="gt-xs">
            <q-avatar size="md">
              <q-img :src="useUserInfo.avatar" fit="cover" />
            </q-avatar>
            <q-tooltip class="desktop-only">个人</q-tooltip>
          </q-btn>

          <q-btn round flat icon="notifications">
            <q-badge color="red" rounded floating>6</q-badge>
            <q-tooltip class="desktop-only">通知</q-tooltip>
          </q-btn>
        </div>
        <!-- 登录 -->
        <q-btn
          v-else
          color="primary"
          unelevated
          label="登录"
          push
          @click="useUserInfo.loginAlert = true"
          class="q-mr-sm"
        />

        <!-- 发布内容 -->
        <q-fab
          push
          v-model="addContent"
          icon="add"
          color="primary"
          padding="xs"
          direction="down"
        >
          <template v-slot:tooltip>
            <q-tooltip class="desktop-only">发布内容</q-tooltip>
          </template>

          <q-fab-action
            v-for="(fabItem, index) in subArticlesInfo"
            :key="index"
            external-label
            label-position="left"
            push
            :color="fabItem.color"
            :icon="fabItem.icon"
            :label="fabItem.label"
            anchor="start"
            @click="subArticleClk(fabItem.to)"
          />
        </q-fab>
      </q-toolbar>
    </q-header>

    <!-- 小屏底部导航 -->
    <q-footer
      :class="themeStore.toolBarColor"
      class="lt-sm"
      v-show="useLayOutStateStore.homeHeader"
      reveal
    >
      <q-tabs
        dense
        :align="'justify'"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab
          v-for="(tabsItem, i) in useUserInfo.role.menu"
          :key="i + 'footertabs'"
          :ripple="{ color: 'primary' }"
          :icon="tabsItem.icon"
          :label="tabsItem.label"
          :to="tabsItem.to"
        />
      </q-tabs>
    </q-footer>
    <!-- 侧边栏 -->
    <menu-dreaws />

    <q-page-container>
      <router-view v-slot="{ Component }">
        <!-- 不缓存 /article/ 的路由 -->
        <keep-alive :exclude="/\/article\/./">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>

    <!-- 登录|注册界面 -->
    <q-dialog
      v-model="useUserInfo.loginAlert"
      no-backdrop-dismiss
      transition-show="flip-right"
      transition-hide="flip-left"
    >
      <q-card flat>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 light-show">{{ lgORs.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-y-sm">
            <q-input
              :disable="lgORs.isLoading"
              no-error-icon
              :maxlength="11"
              dense
              clearable
              suffix="@qq.com"
              name="qqemail"
              v-model="lgORs.email"
              label="QQ邮箱"
              :rules="[qqEmailRules]"
            />

            <q-input
              :disable="lgORs.isLoading"
              dense
              :maxlength="20"
              name="pwd"
              clearable
              :type="lgORs.pwdToText ? 'password' : 'text'"
              v-model="lgORs.pwd"
              :label="lgORs.pwdLabel"
              no-error-icon
              :rules="[pwdRules]"
            >
              <template v-slot:append>
                <q-btn
                  dense
                  flat
                  :icon="lgORs.pwdToText ? 'visibility_off' : 'visibility'"
                  @click="lgORs.pwdToText = !lgORs.pwdToText"
                />
              </template>
            </q-input>

            <q-input
              no-error-icon
              :disable="lgORs.isLoading"
              :rules="[yzmRules]"
              :maxlength="20"
              v-if="lgORs.type !== 0"
              dense
              name="yzm"
              clearable
              type="text"
              prefix="验证码:"
              v-model="lgORs.yzm"
            >
              <template v-slot:after>
                <q-btn
                  dense
                  class="text-body2"
                  :disabled="lgORs.subYzmBtnDisabled"
                  unelevated
                  color="primary"
                  :label="lgORs.subYzmText"
                  :loading="lgORs.subYznBtnload"
                  @click="subEmailYzm"
                />
              </template>
            </q-input>

            <div class="flex justify-between">
              <q-btn
                flat
                @click="lgRsWjBtnck(lgORs.type === 0 ? 1 : 0)"
                color="primary"
                :disable="lgORs.isLoading"
                :label="lgORs.type === 0 ? '注册' : '登陆'"
              />

              <q-btn
                color="red"
                flat
                label="忘记密码?"
                v-show="lgORs.type === 0 ? true : false"
                @click="lgRsWjBtnck(2)"
              />
            </div>

            <q-btn
              unelevated
              :disabled="
                lgORs.type === 0
                  ? false
                  : !lgORs.isSubYzm && !lgORs.subYzmBtnDisabled
              "
              :label="lgORs.type === 2 ? '找回密码' : lgORs.title"
              type="submit"
              rounded
              class="full-width text-body1"
              color="primary"
              :loading="lgORs.isLoading"
            >
              <template v-slot:loading>
                <q-spinner-clock color="white" />
              </template>
            </q-btn>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 音乐播放器界面 -->
    <q-dialog
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="useMusicStore.musicDiaShowModel"
      maximized
      persistent
      v-if="useMusicStore.musicDiaShowModel"
    >
      <q-card class="text-white music-box overflow-hidden bg-black" flat>
        <!-- 顶部 -->
        <q-card-section class="q-py-none q-px-none">
          <q-toolbar>
            <q-toolbar-title class="text-body1 ellipsis">
              {{ useMusicStore.activeIndex.title }}
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
              :src="useMusicStore.activeIndex.img"
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
                        :active="i === useMusicStore.activeIndex.i"
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
    <transition leave-active-class="animated backOutRight slow">
      <q-page-sticky
        :position="useMusicStore.musicSize.pos"
        v-if="useMusicStore.miniMusicPlayShow"
        :offset="useMusicStore.miniOffset"
        :data-id="useMusicStore.activeIndex.id"
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
                  <q-item-label :lines="1" class="text-body1">
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
                          :active="i === useMusicStore.activeIndex.i"
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

    <!-- 图片查看器 -->
    <q-dialog v-model="imgShow.model">
      <q-img
        :src="imgShow.src"
        width="100vw"
        class="overflow-hidden"
        height="100vh"
        fit="contain"
      >
        <template v-slot:loading>
          <q-spinner-clock color="primary" />
        </template>
      </q-img>

      <q-btn
        color="white"
        icon="close"
        flat
        class="fixed-top-right z-max"
        @click.stop="imgShow.model = false"
      />
    </q-dialog>

    <!-- 赠送贡献值 | 收藏  + 新建收藏夹    -->
    <q-dialog
      v-model="useGloabStore.showGiveGxianDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
      :position="useGloabStore.diaLogPos"
      @show="useGloabStore.diaShowEv"
      @hide="useGloabStore.diaHideEv"
      v-if="useGloabStore.showGiveGxianDialogDes"
      no-route-dismiss
    >
      <!-- 赠送贡献值 -->
      <q-card v-if="useGloabStore.diaLog === 0">
        <q-toolbar>
          <q-toolbar-title class="text-body1"
            ><div class="light-show">贡献赠送</div>
          </q-toolbar-title>
          <!-- 自定义赠送切换按钮 -->
          <q-btn
            v-if="useGloabStore.isGuanli"
            class="float-right text-caption"
            color="primary"
            :label="useGloabStore.toggleInputTypeBtnTxt"
            dense
            flat
            @click="useGloabStore.gLiPtUserInputToggle"
          />
        </q-toolbar>

        <q-card-section v-if="!useGloabStore.giveGxType" class="q-pt-none">
          <q-btn-toggle
            v-model="useGloabStore.giveGxianModel"
            rounded
            ripple
            clearable
            outline
            type="toggle"
            class="q-mt-md q-mb-xs"
            :toggle-color="useGloabStore.gieGxColor"
            :options="[
              { slot: 'one', value: '1' },
              { slot: 'three', value: '3' },
              { slot: 'five', value: '5' },
            ]"
          >
            <template #one>
              <div class="row items-center no-wrap">
                <q-icon size="sm">
                  <svg
                    t="1711115225499"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="36808"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M653.948758 680.106922c30.543344-31.116543 34.023484-28.414317 77.545702-40.287736a81.230556 81.230556 0 0 0 56.91052-57.934091c14.944129-56.746749 11.054562-49.909298 51.874554-91.46626 20.307639-20.676124 28.250546-50.850983 20.798953-79.101529-14.903187-56.746749-14.944129-48.844785 0-105.632477a82.950154 82.950154 0 0 0-20.798953-79.101529c-40.819992-41.556963-36.930424-34.719512-51.874554-91.466261a81.230556 81.230556 0 0 0-56.91052-57.934091c-55.764121-15.230729-49.049499-11.259276-89.869491-52.816238a79.5519 79.5519 0 0 0-77.791358-21.208381c-55.682236 15.189786-47.9031 15.230729-103.708164 0a79.510957 79.510957 0 0 0-77.791359 21.208381c-40.779049 41.556963-34.064427 37.585509-89.787605 52.816238A81.230556 81.230556 0 0 0 235.635962 135.076096c-14.944129 56.746749-11.095504 49.950241-51.915496 91.466261a82.868268 82.868268 0 0 0-20.798953 79.101529c14.903187 56.705806 14.944129 48.803842 0 105.632477-7.451593 28.250546 0.491314 58.425405 20.798953 79.101529 40.819992 41.556963 36.930424 34.719512 51.874554 91.466261 7.451593 28.250546 29.151288 50.359669 56.91052 57.93409 44.750503 12.20096 48.107814 10.276648 77.545702 40.287736a79.429072 79.429072 0 0 0 99.45011 11.627761 79.306243 79.306243 0 0 1 84.997296 0 79.429072 79.429072 0 0 0 99.45011-11.627761z m-330.572332-327.951992c0-106.041905 84.465038-191.939942 188.623574-191.939942s188.582631 85.93898 188.582631 191.939942c0 106.041905-84.424096 191.939942-188.582631 191.939942s-188.623574-85.93898-188.623574-191.939942z"
                      :fill="
                        useGloabStore.giveGxianModel === '1'
                          ? '#4499F5'
                          : 'grey'
                      "
                      p-id="36809"
                    ></path>
                    <path
                      d="M322.311913 725.348738c-17.359756-17.400699-8.311393-12.48756-50.195898-23.705893-19.038411-5.117853-35.743082-14.903187-50.850983-26.612833L130.576685 897.390469a31.976343 31.976343 0 0 0 30.829944 44.054475l105.345877-4.012396 72.468792 76.522131a31.976343 31.976343 0 0 0 52.816238-9.908163l104.035707-255.155656a145.101355 145.101355 0 0 1-70.585422 19.16124c-38.977565 0-75.621389-15.148844-103.175908-42.703362zM893.423315 897.431412l-90.688347-222.4014c-15.148844 11.750589-31.853514 21.494981-50.850983 26.612833-42.130162 11.259276-32.877085 6.346137-50.195898 23.705893a145.01947 145.01947 0 0 1-103.175908 42.703362 145.347012 145.347012 0 0 1-70.626365-19.16124l104.035707 255.155656c8.802706 21.494981 36.848538 26.776605 52.816238 9.908163l72.468792-76.563074 105.38682 4.053339a31.976343 31.976343 0 0 0 30.829944-44.054475z"
                      :fill="
                        useGloabStore.giveGxianModel === '1'
                          ? '#4499F5'
                          : 'grey'
                      "
                      opacity=".3"
                      p-id="36810"
                    ></path>
                  </svg>
                </q-icon>
                <div class="text-center">&nbsp;×&nbsp;1</div>
              </div>
            </template>

            <template #three>
              <div class="row items-center no-wrap">
                <q-icon size="sm">
                  <svg
                    t="1711115225499"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="36808"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M653.948758 680.106922c30.543344-31.116543 34.023484-28.414317 77.545702-40.287736a81.230556 81.230556 0 0 0 56.91052-57.934091c14.944129-56.746749 11.054562-49.909298 51.874554-91.46626 20.307639-20.676124 28.250546-50.850983 20.798953-79.101529-14.903187-56.746749-14.944129-48.844785 0-105.632477a82.950154 82.950154 0 0 0-20.798953-79.101529c-40.819992-41.556963-36.930424-34.719512-51.874554-91.466261a81.230556 81.230556 0 0 0-56.91052-57.934091c-55.764121-15.230729-49.049499-11.259276-89.869491-52.816238a79.5519 79.5519 0 0 0-77.791358-21.208381c-55.682236 15.189786-47.9031 15.230729-103.708164 0a79.510957 79.510957 0 0 0-77.791359 21.208381c-40.779049 41.556963-34.064427 37.585509-89.787605 52.816238A81.230556 81.230556 0 0 0 235.635962 135.076096c-14.944129 56.746749-11.095504 49.950241-51.915496 91.466261a82.868268 82.868268 0 0 0-20.798953 79.101529c14.903187 56.705806 14.944129 48.803842 0 105.632477-7.451593 28.250546 0.491314 58.425405 20.798953 79.101529 40.819992 41.556963 36.930424 34.719512 51.874554 91.466261 7.451593 28.250546 29.151288 50.359669 56.91052 57.93409 44.750503 12.20096 48.107814 10.276648 77.545702 40.287736a79.429072 79.429072 0 0 0 99.45011 11.627761 79.306243 79.306243 0 0 1 84.997296 0 79.429072 79.429072 0 0 0 99.45011-11.627761z m-330.572332-327.951992c0-106.041905 84.465038-191.939942 188.623574-191.939942s188.582631 85.93898 188.582631 191.939942c0 106.041905-84.424096 191.939942-188.582631 191.939942s-188.623574-85.93898-188.623574-191.939942z"
                      :fill="
                        useGloabStore.giveGxianModel === '3'
                          ? '#4499F5'
                          : 'grey'
                      "
                      p-id="36809"
                    ></path>
                    <path
                      d="M322.311913 725.348738c-17.359756-17.400699-8.311393-12.48756-50.195898-23.705893-19.038411-5.117853-35.743082-14.903187-50.850983-26.612833L130.576685 897.390469a31.976343 31.976343 0 0 0 30.829944 44.054475l105.345877-4.012396 72.468792 76.522131a31.976343 31.976343 0 0 0 52.816238-9.908163l104.035707-255.155656a145.101355 145.101355 0 0 1-70.585422 19.16124c-38.977565 0-75.621389-15.148844-103.175908-42.703362zM893.423315 897.431412l-90.688347-222.4014c-15.148844 11.750589-31.853514 21.494981-50.850983 26.612833-42.130162 11.259276-32.877085 6.346137-50.195898 23.705893a145.01947 145.01947 0 0 1-103.175908 42.703362 145.347012 145.347012 0 0 1-70.626365-19.16124l104.035707 255.155656c8.802706 21.494981 36.848538 26.776605 52.816238 9.908163l72.468792-76.563074 105.38682 4.053339a31.976343 31.976343 0 0 0 30.829944-44.054475z"
                      :fill="
                        useGloabStore.giveGxianModel === '3'
                          ? '#4499F5'
                          : 'grey'
                      "
                      opacity=".3"
                      p-id="36810"
                    ></path>
                  </svg>
                </q-icon>
                <div class="text-center">&nbsp;×&nbsp;3</div>
              </div>
            </template>

            <template #five>
              <div class="row items-center no-wrap">
                <q-icon size="sm">
                  <svg
                    t="1711115225499"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="36808"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M653.948758 680.106922c30.543344-31.116543 34.023484-28.414317 77.545702-40.287736a81.230556 81.230556 0 0 0 56.91052-57.934091c14.944129-56.746749 11.054562-49.909298 51.874554-91.46626 20.307639-20.676124 28.250546-50.850983 20.798953-79.101529-14.903187-56.746749-14.944129-48.844785 0-105.632477a82.950154 82.950154 0 0 0-20.798953-79.101529c-40.819992-41.556963-36.930424-34.719512-51.874554-91.466261a81.230556 81.230556 0 0 0-56.91052-57.934091c-55.764121-15.230729-49.049499-11.259276-89.869491-52.816238a79.5519 79.5519 0 0 0-77.791358-21.208381c-55.682236 15.189786-47.9031 15.230729-103.708164 0a79.510957 79.510957 0 0 0-77.791359 21.208381c-40.779049 41.556963-34.064427 37.585509-89.787605 52.816238A81.230556 81.230556 0 0 0 235.635962 135.076096c-14.944129 56.746749-11.095504 49.950241-51.915496 91.466261a82.868268 82.868268 0 0 0-20.798953 79.101529c14.903187 56.705806 14.944129 48.803842 0 105.632477-7.451593 28.250546 0.491314 58.425405 20.798953 79.101529 40.819992 41.556963 36.930424 34.719512 51.874554 91.466261 7.451593 28.250546 29.151288 50.359669 56.91052 57.93409 44.750503 12.20096 48.107814 10.276648 77.545702 40.287736a79.429072 79.429072 0 0 0 99.45011 11.627761 79.306243 79.306243 0 0 1 84.997296 0 79.429072 79.429072 0 0 0 99.45011-11.627761z m-330.572332-327.951992c0-106.041905 84.465038-191.939942 188.623574-191.939942s188.582631 85.93898 188.582631 191.939942c0 106.041905-84.424096 191.939942-188.582631 191.939942s-188.623574-85.93898-188.623574-191.939942z"
                      :fill="
                        useGloabStore.giveGxianModel === '5'
                          ? '#4499F5'
                          : 'grey'
                      "
                      p-id="36809"
                    ></path>
                    <path
                      d="M322.311913 725.348738c-17.359756-17.400699-8.311393-12.48756-50.195898-23.705893-19.038411-5.117853-35.743082-14.903187-50.850983-26.612833L130.576685 897.390469a31.976343 31.976343 0 0 0 30.829944 44.054475l105.345877-4.012396 72.468792 76.522131a31.976343 31.976343 0 0 0 52.816238-9.908163l104.035707-255.155656a145.101355 145.101355 0 0 1-70.585422 19.16124c-38.977565 0-75.621389-15.148844-103.175908-42.703362zM893.423315 897.431412l-90.688347-222.4014c-15.148844 11.750589-31.853514 21.494981-50.850983 26.612833-42.130162 11.259276-32.877085 6.346137-50.195898 23.705893a145.01947 145.01947 0 0 1-103.175908 42.703362 145.347012 145.347012 0 0 1-70.626365-19.16124l104.035707 255.155656c8.802706 21.494981 36.848538 26.776605 52.816238 9.908163l72.468792-76.563074 105.38682 4.053339a31.976343 31.976343 0 0 0 30.829944-44.054475z"
                      :fill="
                        useGloabStore.giveGxianModel === '5'
                          ? '#4499F5'
                          : 'grey'
                      "
                      opacity=".3"
                      p-id="36810"
                    ></path>
                  </svg>
                </q-icon>
                <div class="text-center">&nbsp;×&nbsp;5</div>
              </div>
            </template>
          </q-btn-toggle>
        </q-card-section>

        <!-- 自定义赠送，仅限管理员或特殊成员 -->
        <q-card-section class="mini-heriz-bottom" v-else>
          <q-input
            type="number"
            placeholder="输入赠送数量"
            outlined
            v-model.number.trim="useGloabStore.editGxianCount"
            value="1"
            dense
            :maxlength="4"
            :rules="[giveGxinRule]"
            rounded
          >
            <template #prepend>
              <q-icon size="sm">
                <svg
                  t="1711115225499"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="36808"
                  width="200"
                  height="200"
                >
                  <path
                    d="M653.948758 680.106922c30.543344-31.116543 34.023484-28.414317 77.545702-40.287736a81.230556 81.230556 0 0 0 56.91052-57.934091c14.944129-56.746749 11.054562-49.909298 51.874554-91.46626 20.307639-20.676124 28.250546-50.850983 20.798953-79.101529-14.903187-56.746749-14.944129-48.844785 0-105.632477a82.950154 82.950154 0 0 0-20.798953-79.101529c-40.819992-41.556963-36.930424-34.719512-51.874554-91.466261a81.230556 81.230556 0 0 0-56.91052-57.934091c-55.764121-15.230729-49.049499-11.259276-89.869491-52.816238a79.5519 79.5519 0 0 0-77.791358-21.208381c-55.682236 15.189786-47.9031 15.230729-103.708164 0a79.510957 79.510957 0 0 0-77.791359 21.208381c-40.779049 41.556963-34.064427 37.585509-89.787605 52.816238A81.230556 81.230556 0 0 0 235.635962 135.076096c-14.944129 56.746749-11.095504 49.950241-51.915496 91.466261a82.868268 82.868268 0 0 0-20.798953 79.101529c14.903187 56.705806 14.944129 48.803842 0 105.632477-7.451593 28.250546 0.491314 58.425405 20.798953 79.101529 40.819992 41.556963 36.930424 34.719512 51.874554 91.466261 7.451593 28.250546 29.151288 50.359669 56.91052 57.93409 44.750503 12.20096 48.107814 10.276648 77.545702 40.287736a79.429072 79.429072 0 0 0 99.45011 11.627761 79.306243 79.306243 0 0 1 84.997296 0 79.429072 79.429072 0 0 0 99.45011-11.627761z m-330.572332-327.951992c0-106.041905 84.465038-191.939942 188.623574-191.939942s188.582631 85.93898 188.582631 191.939942c0 106.041905-84.424096 191.939942-188.582631 191.939942s-188.623574-85.93898-188.623574-191.939942z"
                    fill="#4499F5"
                    p-id="36809"
                  ></path>
                  <path
                    d="M322.311913 725.348738c-17.359756-17.400699-8.311393-12.48756-50.195898-23.705893-19.038411-5.117853-35.743082-14.903187-50.850983-26.612833L130.576685 897.390469a31.976343 31.976343 0 0 0 30.829944 44.054475l105.345877-4.012396 72.468792 76.522131a31.976343 31.976343 0 0 0 52.816238-9.908163l104.035707-255.155656a145.101355 145.101355 0 0 1-70.585422 19.16124c-38.977565 0-75.621389-15.148844-103.175908-42.703362zM893.423315 897.431412l-90.688347-222.4014c-15.148844 11.750589-31.853514 21.494981-50.850983 26.612833-42.130162 11.259276-32.877085 6.346137-50.195898 23.705893a145.01947 145.01947 0 0 1-103.175908 42.703362 145.347012 145.347012 0 0 1-70.626365-19.16124l104.035707 255.155656c8.802706 21.494981 36.848538 26.776605 52.816238 9.908163l72.468792-76.563074 105.38682 4.053339a31.976343 31.976343 0 0 0 30.829944-44.054475z"
                    fill="#4499F5"
                    opacity=".3"
                    p-id="36810"
                  ></path>
                </svg>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="mini-heirz">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn
            label="赠送"
            @click="useGloabStore.startGivegXian"
            color="primary"
            unelevated
            :loading="useGloabStore.giveGxBtnLoad"
            :disable="useGloabStore.giveBtnDisabled"
          />
        </q-card-actions>
      </q-card>

      <!--用户界面收藏夹 + 新建收藏夹按钮-->
      <q-card v-else class="full-width">
        <q-item class="q-py-none mini-heriz-bottom">
          <q-item-section class="q-py-none">
            <q-item-label class="light-show"
              ><q-icon name="bookmark_border" size="sm" /> 收藏夹
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              label="新建收藏夹"
              color="primary"
              flat
              :class="useGloabStore.diaLogClass"
              icon="add"
              @click="useGloabStore.openStarModel"
            />
          </q-item-section>
        </q-item>

        <!-- tabs -->
        <q-card-section class="no-padding">
          <q-tabs
            align="center"
            v-model="useGloabStore.gxStarDialogModel"
            active-color="primary"
            indicator-color="transparent"
            breakpoint="xs"
            inline-label
            active-class="primary"
          >
            <q-tab :name="0" icon="r_article" label="内容" />
            <q-separator vertical inset />
            <q-tab :name="1" icon="r_music_note" label="音乐" />
          </q-tabs>
        </q-card-section>

        <!-- 收藏列表 -->
        <q-card-section class="no-padding">
          <q-tab-panels
            v-model="useGloabStore.gxStarDialogModel"
            @transition="useGloabStore.starListTransition"
          >
            <!-- 内容收藏 -->
            <q-tab-panel :name="0" class="no-padding">
              <q-scroll-area
                v-if="useUserInfo.star.articleData.length"
                style="height: 240px"
                class="now-scroll set-scroll-width"
              >
                <q-list class="trigger">
                  <q-item
                    tag="label"
                    class="op-0"
                    v-ripple
                    v-for="(it, i) in useUserInfo.star.articleData"
                    ref="diaLogEl"
                  >
                    <q-item-section avatar class="ellipsis">
                      <q-checkbox v-model="useGloabStore.stars" :val="it.id" />
                    </q-item-section>

                    <!-- 收藏标题 -->
                    <q-item-section>
                      <q-item-label :lines="1">{{ it.title }} </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
              <q-avatar v-else size="15rem" class="q-mx-auto block">
                <img src="@/assets/styles/noneStyle/starNone.svg" />
              </q-avatar>
            </q-tab-panel>

            <!-- 音乐收藏 -->
            <q-tab-panel :name="1" class="no-padding">
              <q-scroll-area
                v-if="useUserInfo.star.musicData.length"
                style="height: 240px"
                class="now-scroll set-scroll-width"
              >
                <q-list class="trigger">
                  <q-item
                    tag="label"
                    class="op-0"
                    v-ripple
                    v-for="(it, i) in useUserInfo.star.musicData"
                    ref="diaLogEl"
                  >
                    <q-item-section avatar class="ellipsis">
                      <q-checkbox v-model="useGloabStore.stars" :val="it.id" />
                    </q-item-section>

                    <!-- 收藏标题 -->
                    <q-item-section>
                      <q-item-label :lines="1">{{ it.title }} </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
              <q-avatar v-else size="15rem" class="q-mx-auto block">
                <img src="@/assets/styles/noneStyle/starNone.svg" />
              </q-avatar>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-separator />

        <!-- 操作栏 -->
        <q-card-actions vertical align="right">
          <q-btn
            label="完成"
            color="primary"
            :class="useGloabStore.diaLogClass"
            icon="check"
            unelevated
            @click="useGloabStore.startFinish"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 新建收藏夹弹窗 + 编辑收藏夹弹窗 -->
    <q-dialog
      v-model="useGloabStore.newStarModel"
      v-if="useGloabStore.showNewStarModel"
      transition-show="slide-up"
      transition-hide="slide-up"
      persistent
      :full-width="useGloabStore.createStarDialogShowType.fullWidth"
    >
      <!-- 编辑收藏夹信息 -->
      <q-card
        v-if="useGloabStore.editStarInfo"
        :style="{ width: useGloabStore.createStarDialogShowType.width }"
      >
        <q-card-section class="mini-heriz-bottom">
          <div class="light-show text-body1">编辑收藏夹</div>
        </q-card-section>

        <q-card-section>
          <!-- 编辑收藏夹信息 -->
          <q-item key="star-crate" clickable v-ripple>
            <q-item-section>更换封面</q-item-section>
            <q-item-section avatar>
              <q-avatar
                rounded
                size="5.5em"
                v-if="
                  useGloabStore.editStarObj.img &&
                  useGloabStore.editStarObj.img.length
                "
              >
                <q-img :src="useGloabStore.editStarObj.img" :ratio="1" />
              </q-avatar>
              <q-avatar
                v-else
                rounded
                size="5.5em"
                icon="r_star_border"
                text-color="grey"
              />
            </q-item-section>
          </q-item>

          <!--编辑框 -->
          <div>
            <q-input
              v-model="useGloabStore.editStarObj.title"
              :debounce="100"
              :maxlength="50"
              counter
              clearable
              :rules="[newColsRule]"
              placeholder="输入收藏夹名称"
              autofocus
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="关闭" color="primary" v-close-popup />
          <q-btn
            label="修改"
            color="primary"
            :disable="useGloabStore.upStarBtnDisabled"
            unelevated
            icon="check"
            @click="useGloabStore.updateStarInfo"
          />
        </q-card-actions>
      </q-card>

      <!-- 新建收藏夹   -->
      <q-card
        v-else
        :style="{ width: useGloabStore.createStarDialogShowType.width }"
      >
        <q-card-section class="mini-heriz-bottom">
          <div class="light-show text-body1">新建收藏夹</div>
        </q-card-section>

        <q-card-section>
          <!-- 新建收藏夹 -->
          <div key="star-edit" class="flex">
            <q-radio
              :color="useGloabStore.newStaType ? '' : 'primary'"
              v-model="useGloabStore.newStaType"
              checked-icon="r_article"
              unchecked-icon="o_article"
              :val="0"
              label="内容"
              class="q-mr-sm"
              :class="useGloabStore.newStaType ? '' : 'text-primary'"
            />
            <q-separator inset vertical spaced="md" />
            <q-radio
              v-model="useGloabStore.newStaType"
              checked-icon="r_music_note"
              unchecked-icon="o_music_note"
              :color="useGloabStore.newStaType ? 'primary' : ''"
              :val="1"
              :class="useGloabStore.newStaType ? 'text-primary' : ''"
              label="音乐"
            />
          </div>

          <!-- 输入框 -->
          <div>
            <q-input
              v-model="useGloabStore.createStarName"
              :debounce="100"
              :maxlength="50"
              counter
              clearable
              :rules="[newColsRule]"
              placeholder="输入收藏夹名称"
              autofocus
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="关闭" color="primary" v-close-popup />
          <q-btn
            label="新建"
            color="primary"
            :disable="useGloabStore.crateStarBtnDisabled"
            unelevated
            icon="check"
            @click="useGloabStore.createCollection"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 收藏详细信息 -->
    <q-dialog
      v-if="useUserInfo.starDiaModel"
      v-model="useUserInfo.starDiaModel"
      no-esc-dismiss
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      maximized
    >
      <q-card>
        <q-card-section class="no-padding">
          <q-toolbar>
            <q-btn flat round size="sm" icon="r_arrow_back_ios" v-close-popup />
            <q-space />
            <!-- v-model="text" -->
            <q-input
              dense
              :maxlength="15"
              outlined
              rounded
              stack-label
              placeholder="搜索此收藏"
              :debounce="300"
              clearable
              input-class="q-py-none"
              class="star-search"
              borderless
            />
          </q-toolbar>
        </q-card-section>

        <!-- 收藏内容 -->
        <q-card-section
          style="height: calc(100vh - 50px)"
          class="q-pt-none overflow-auto"
        >
          <!-- 收藏信息 -->
          <q-card-section horizontal>
            <!-- 封面 -->
            <div style="width: 110px; height: 110px">
              <q-img
                class="rounded-borders"
                src="/testImg/red roses.jpg"
                :ratio="1"
              />
              <q-badge
                class="absolute-top-left"
                color="light-blue"
                label="× 3"
              />
            </div>

            <!-- 收藏标题 -->
            <div class="q-pl-md col">
              <!-- 收藏创建者 跳转个人主页-->
              <div
                class="flex no-wrap items-center cursor-pointer relative-position"
                v-ripple
              >
                <q-avatar size="sm">
                  <q-img src="/testImg/road-1072821_1920.jpg" :ratio="1" />
                </q-avatar>

                <q-item-label class="q-pl-sm" :lines="1"
                  >收藏创建者收藏创建者收藏创建者收藏创建者收藏创建者收藏创建者收藏创建者收藏创建者收藏创建者收藏创建者收藏创建者收藏创建者</q-item-label
                >
              </div>
              <div class="q-pt-sm">
                标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题
              </div>
            </div>
          </q-card-section>

          <!-- 点赞| 评论 、 收藏 -->
          <div class="q-gutter-md q-py-md">
            <!-- 点赞 -->
            <q-btn
              color="pink"
              icon="r_favorite_border"
              label="12"
              unelevated
              rounded
              outline
              size="sm"
            />

            <!-- 收藏数量 -->
            <q-btn
              color="blue"
              icon="r_bookmark_add"
              label="1.3k"
              unelevated
              rounded
              outline
              size="sm"
            />

            <!-- 评论 -->
            <q-btn
              color="teal"
              icon="o_mode_comment"
              label="12"
              unelevated
              rounded
              outline
              size="sm"
            />

            <!-- 编辑 -->
            <q-btn
              color="orange"
              icon="r_edit"
              unelevated
              rounded
              outline
              size="sm"
            />
          </div>

          <!-- 内容 -->
          <div class="q-gutter-y-sm">
            <div
              v-for="i in 20"
              class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 row"
            >
              <!-- active -->
              <q-item clickable v-ripple class="col-11 q-px-none">
                <q-item-section side class="text-grey">
                  {{ i }}
                </q-item-section>

                <q-item-section avatar top>
                  <q-avatar rounded>
                    <q-img
                      src="/testImg/road-1072821_1920.jpg"
                      class="rounded-borders"
                      ratio="1"
                    >
                      <template #loading>
                        <q-spinner-cube color="primary" size="xs" />
                      </template>
                    </q-img>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label lines="1">
                    标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题
                  </q-item-label>

                  <!-- 歌曲信息 -->
                  <q-item-label caption class="flex no-wrap q-pt-xs">
                    <!-- 歌曲作者 -->
                    <span class="flex items-center q-mr-md"> 歌曲作者 </span>

                    <!-- 听歌次数 -->
                    <span class="flex items-center q-mr-md"
                      ><q-icon name="r_headphones" />&nbsp;126
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-btn
                size="sm"
                class="col"
                flat
                dense
                icon="r_more_vert"
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

                    <q-item
                      clickable
                      v-close-popup
                      @click="userInfoStore.setTop"
                    >
                      <q-item-section side>
                        <q-icon name="r_change_history" size="sm" />
                      </q-item-section>
                      <q-item-section> 置顶 </q-item-section>
                    </q-item>

                    <q-separator />
                    <q-item clickable v-close-popup>
                      <q-item-section side>
                        <q-icon name="o_delete" size="sm" />
                      </q-item-section>
                      <q-item-section> 删除 </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <div class="text-center text-grey q-pt-md">这是我的底线~</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template> 

<script setup>
import { ref, provide, computed, onBeforeMount, reactive } from "vue";
import { useQuasar, debounce } from "quasar";
import MenuDreaws from "./components/MenuDreaws.vue";
import { theme } from "./stores/themeStore";
import useUserInfoStore from "./stores/userInfo";
import {
  lgORs,
  onSubmit,
  subEmailYzm,
  lgRsWjBtnck,
} from "./utils/loginOrRegister.js";
import { yzmRules, pwdRules, qqEmailRules } from "./utils/rules.js";
import menuAndAuth from "./api/menuAndAuth.js";
import md5 from "./utils/md5.js";
import sse from "./utils/sse.js";
import { useRouter } from "vue-router";
import layOutStateStore from "./stores/layoutState.js";
import gloabStore, { diaLogEl } from "./stores/starUpGxStrore";
import musicStore, { musicVizCanvas } from "./stores/musicStore";
import { newColsRule } from "./utils/rules";

const useGloabStore = gloabStore();
const useMusicStore = musicStore();
const playNextMusic = debounce(useMusicStore.playNextMusic, 251),
  toggleMuiscPlay = debounce(useMusicStore.toggleMuiscPlay, 251),
  playPreMusic = debounce(useMusicStore.playPreMusic, 251),
  musicPlayTypeToggle = debounce(useMusicStore.musicPlayTypeToggle, 251);

const useLayOutStateStore = layOutStateStore();
const $r = useRouter();

const subArticlesInfo = [
  {
    color: "secondary",
    icon: "translate",
    label: "博文",
    to: "/articlesedit",
  },

  {
    color: "positive",
    icon: "music_note",
    label: "音乐",
    to: "/articlesedit",
  },

  {
    color: "accent",
    icon: "ondemand_video",
    label: "视频",
    to: "/articlesedit",
  },

  {
    color: "yellow",
    icon: "image",
    label: "图片",
    to: "/articlesedit",
  },

  {
    color: "blue-grey",
    icon: "access_time",
    label: "草稿",
    to: "/articlesedit",
  },
];

// 点击编辑内容跳转
const subArticleClk = (to) => {
  const openUrl = $r.resolve({
    path: to,
  });
  // 打开新窗口
  window.open(openUrl.href);
};

const useUserInfo = useUserInfoStore();
const themeStore = theme();

const $q = useQuasar(),
  tabsMenu = ref();

const searchText = ref("");
const addContent = ref(false);
const placeholderText = ref("奥迪RS7奥迪RS7奥迪RS7");
// 默认菜单
const defaultRole = {
  role: -1,
  auth: [100, 103],
  menu: [
    {
      to: "/home",
      icon: "home",
      label: "首页",
    },
    {
      to: "/faxian",
      icon: "r_widgets",
      label: "发现",
    },

    // {
    //   to: "/admin",
    //   icon: "security",
    //   label: "管理",
    // },

    {
      to: "/users",
      icon: "person",
      label: "我",
    },
  ],
};

const gapSize = computed(() => {
  let gap = 8,
    name = null;

  if ($q.screen.sm || $q.screen.md) {
    gap = 16;
  } else if ($q.screen.lg) {
    gap = 24;
  } else if ($q.screen.xl) {
    gap = 32;
  }

  name = $q.screen.name;
  $q.screen.xs ? (name = "sm") : (name = "md");

  return {
    num: gap,
    pix: gap + "px",
    name,
  };
});

onBeforeMount(async () => {
  // 建立信息推送连接
  sse();
  const { email, token } = useUserInfo;
  if (token && email) {
    const nt = new Date().getTime();
    const maRes = await menuAndAuth({
      nt,
      sign: md5(email + nt + "menuAuth2024/3/5 21:35").toLocaleUpperCase(),
    });

    if (maRes.statu === 200) {
      const { msg } = maRes,
        { role } = msg;
      useUserInfo.role = role;
      return true;
    }
  }
  useUserInfo.role = defaultRole;
});

const imgShow = reactive({
  src: "",
  model: false,
});
provide("tabsMenu", tabsMenu);
provide("themeStore", themeStore);
provide("gapSize", gapSize);
provide("imgShow", imgShow);
</script>

<style lang="sass" scoped>
</style>
 

<!-- 全局sass -->
<style lang="sass">
@import url('./assets/styles/global.sass')

.light-show
  border-left: solid 4px $primary
  padding-left: 8px

.body--light
  background: $grey-3
</style>
 
