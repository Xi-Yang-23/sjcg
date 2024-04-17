<template>
  <q-page>
    <!-- 背景 :src="userInfoStore.bg"  -->
    <q-img
      src="/testImg/red heart tree.jpg"
      height="100%"
      id="bg"
      class="cursor-pointer"
      :img-style="{ paddingLeft: useScreenStore.user.bgPaddinfLeft }"
      @click="userClk(0)"
      img-class="pc-img-pix"
    >
      <template v-slot:loading>
        <q-spinner-facebook color="primary" />
      </template>
    </q-img>

    <div
      style="margin-top: 20vh"
      :class="{ 'text-white': useScreenStore.isAdminTitle }"
    >
      <!-- 头像 -->
      <q-avatar
        size="60px"
        class="absolute cursor-pointer"
        style="z-index: 1"
        :style="{ transform: `translate(${gapSize.pix}, -50%)` }"
        @click="userClk(1)"
      >
        <!-- 用户认证 -->
        <q-icon size="sm" class="absolute-bottom-right z-top ren-zheng">
          <svg
            t="1709780406929"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4742"
            width="200"
            height="200"
          >
            <path
              d="M855.458909 138.379636a622.312727 622.312727 0 0 1-197.818182-48.546909c-37.608727-16.989091-95.883636-55.854545-129.861818-80.058182a51.153455 51.153455 0 0 0-58.274909 0c-33.978182 24.203636-92.206545 63.069091-131.072 80.058182a622.312727 622.312727 0 0 1-197.818182 48.546909C113.943273 139.589818 93.277091 162.629818 93.277091 189.346909v305.803636a456.657455 456.657455 0 0 0 214.807273 387.165091l94.673454 59.485091 67.956364 42.496a52.596364 52.596364 0 0 0 53.434182 0l67.956363-42.496 94.673455-59.485091a456.657455 456.657455 0 0 0 214.807273-387.118545V188.136727a47.662545 47.662545 0 0 0-46.126546-49.757091z"
              fill="#45BE89"
              p-id="4743"
            ></path>
            <path
              d="M498.641455 638.370909a34.909091 34.909091 0 0 1-25.460364 10.938182h-3.677091a38.306909 38.306909 0 0 1-26.670545-15.778909l-134.749091-133.492364c-10.891636-12.101818-15.732364-36.398545 1.256727-53.387636 15.778909-14.568727 40.029091-12.148364 58.228364 6.050909l111.662545 103.144727 200.238545-200.238545a37.794909 37.794909 0 0 1 52.177455 1.210182c10.938182 14.568727 10.938182 37.655273-2.420364 50.967272l-230.586181 230.586182z"
              fill="#FFFFFF"
              p-id="4744"
            ></path>
          </svg>
        </q-icon>

        <q-img src="https://cdn.quasar.dev/img/boy-avatar.png" :ratio="1">
          <template v-slot:loading>
            <q-spinner-puff color="primary" />
          </template>
        </q-img>
      </q-avatar>

      <!-- 用户信息-->
      <q-card
        class="user-top"
        :class="{ 'user-admin': useScreenStore.isAdminTitle }"
        flat
      >
        <q-card-section>
          <div style="margin-left: 60px" class="flex">
            <div>
              <q-btn unelevated>
                <span class="text-body1">关注</span>
                <div class="text-h6 q-pl-xs">0</div>
              </q-btn>
            </div>
            <q-separator vertical :dark="useScreenStore.isAdminTitle" inset />
            <div>
              <q-btn unelevated>
                <span class="text-body1">粉丝</span>
                <div class="text-h6 q-pl-xs">12</div>
              </q-btn>
            </div>
            <q-separator vertical :dark="useScreenStore.isAdminTitle" inset />
            <q-btn unelevated>
              <span class="text-body1">获赞</span>
              <div class="text-h6 q-pl-xs">32</div>
            </q-btn>
          </div>
          <div class="flex column">
            <!-- 用户名 -->
            <div class="text-h6 ellipsis cursor-pointer" @click="userClk(2)">
              <!-- {{ userInfoStore.userName }} -->
              用户名
            </div>

            <!-- 用户基本信息 -->
            <div class="flex items-center q-gutter-x-sm">
              <q-badge color="blue" label="审核员" />
              <div class="text-caption flex items-center">
                <!-- female男 女male -->
                <q-icon
                  :name="userInfoStore.sex ? 'male' : 'female'"
                  :color="userInfoStore.sex ? 'pink' : 'blue'"
                />{{ userInfoStore.sex ? "女" : "男" }}
              </div>
              <!-- ip -->
              <div class="text-caption flex items-center">
                <q-icon name="place" />贵州
              </div>

              <!-- 状态 在线　green-13  | 离线 blue-grey-->
              <span class="text-caption">
                <div v-if="userInfoStore.online === -1">
                  <q-spinner color="primary" class="q-mr-xs" />加载中...
                </div>
                <div v-else class="flex items-center">
                  <q-badge
                    :color="userInfoStore.online ? 'green-13' : 'blue-grey'"
                    class="q-mr-xs"
                    rounded
                  />
                  {{ userInfoStore.online ? "在线" : "离线" }}
                </div>
              </span>
            </div>
          </div>
        </q-card-section>

        <!-- 简介 -->
        <q-card-section class="q-pt-none cursor-pointer" @click="userClk(3)">
          <!-- {{ userInfoStore.describe }} -->
          简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介
        </q-card-section>
      </q-card>
      <!-- tab -->
      <q-card
        :class="{ 'user-admin-tab-bar': useScreenStore.isAdminTitle }"
        square
        flat
        v-intersection="onIntersection"
      >
        <q-tabs
          :inline-label="useScreenStore.user.tabInline"
          :align="useScreenStore.user.tabAlign"
          v-model="userInfoStore.tabMenuModel"
          @update:model-value="userInfoStore.TabsCheckEv"
        >
          <q-tab
            name="article"
            icon="r_library_books"
            label="内容"
            class="text-purple-12"
          />
          <q-tab
            name="music"
            icon="r_library_music"
            label="音乐"
            class="text-light-blue"
          />
          <q-tab
            name="star"
            icon="r_star_border"
            label="收藏"
            class="text-teal"
          />
          <q-tab
            name="shenHe"
            icon="r_security"
            label="审核中"
            class="text-deep-orange"
          />
        </q-tabs>
      </q-card>

      <!-- tab内容 -->
      <q-tab-panels
        style="min-height: calc(100vh - 20vh)"
        v-model="userInfoStore.tabMenuModel"
        :class="{ 'user-admin-tab-bar': useScreenStore.isAdminTitle }"
      >
        <!-- 内容 -->
        <q-tab-panel
          name="article"
          :style="{ 'margin-bottom': Screen.gt.xs ? '58px' : '46px' }"
          class="q-pa-none"
        >
          <!-- 最新 | 最热 -->
          <q-tabs
            align="left"
            dense
            v-model="userInfoStore.article.sort"
            active-color="primary"
            indicator-color="transparent"
            breakpoint="xs"
            inline-label
            :active-class="
              userInfoStore.article.sort ? 'text-red' : 'text-green'
            "
          >
            <q-tab :name="0" icon="r_access_time" label="新" />
            <q-tab :name="1" icon="r_whatshot" label="热" />
          </q-tabs>

          <q-tab-panels
            v-model="userInfoStore.article.sort"
            :class="{ 'bg-transparent': useScreenStore.isAdminTitle }"
          >
            <!-- 最新 -->
            <q-tab-panel
              :name="0"
              :class="useScreenStore.user.contentGap"
              class="row no-padding"
            >
              <div
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                v-for="i in 10"
                :key="i + 'user-card'"
              >
                <q-card
                  square
                  flat
                  :class="{ 'bg-transparent': useScreenStore.isAdminTitle }"
                >
                  <q-card-section
                    horizontal
                    v-ripple:grey
                    class="cursor-pointer"
                  >
                    <q-card-section class="flex flex-center q-pb-xs">
                      <!-- :src="it.img" -->
                      <q-img
                        src="/testImg/road-1072821_1920.jpg"
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
                      >
                        <!-- {{ it.title }} -->
                        <!-- 置顶 -->
                        <q-badge
                          color="blue-grey-8"
                          v-if="i === 1"
                          label="T1"
                          class="q-mr-xs"
                        />
                        <q-badge
                          color="blue-grey-6"
                          v-if="i === 2"
                          label="T2"
                          class="q-mr-xs"
                        />
                        <q-badge
                          color="blue-grey-4"
                          v-if="i === 3"
                          label="T3"
                          class="q-mr-xs"
                        />
                        标题标题标题标题标题标题标题标题标题标题
                      </q-item-label>
                      <q-item-label class="text-body2 q-pt-sm" :lines="3">
                        <!-- {{ it.content }} -->
                        内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                      </q-item-label>
                    </q-card-section>
                  </q-card-section>

                  <q-card-actions
                    :class="{ 'text-grey': !useScreenStore.isAdminTitle }"
                    class="text-caption q-pt-none"
                  >
                    <!-- 发布日期 -->
                    <q-item-label class="flex items-center q-mr-md q-mt-xs">
                      <q-icon name="o_access_time" />&nbsp;2024/1/1
                    </q-item-label>

                    <!-- 浏览 -->
                    <q-item-label class="flex items-center q-mr-md"
                      ><q-icon name="o_remove_red_eye" />&nbsp;23
                    </q-item-label>

                    <!-- 点赞 -->
                    <q-item-label class="flex items-center q-mr-md">
                      <q-icon name="r_favorite_border" />&nbsp;23
                    </q-item-label>

                    <!-- 收藏 -->
                    <q-item-label class="flex items-center q-mr-md">
                      <q-icon size="1.4em" name="r_star_border" />&nbsp;1
                    </q-item-label>

                    <!-- 评论 -->
                    <q-item-label class="flex items-center">
                      <q-icon name="o_mode_comment" />&nbsp;0
                    </q-item-label>

                    <q-space />
                    <q-btn flat class="q-mt-xs" size="sm" icon="r_more_horiz">
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
                  </q-card-actions>
                </q-card>
              </div>
              <!-- 分页 -->
              <q-page-scroller
                position="bottom"
                :scroll-offset="100"
                :duration="10"
                :offset="[0, 8]"
              >
                <q-pagination
                  :size="Screen.gt.xs ? 'lg' : '1em'"
                  v-model="userInfoStore.article.newCurPage"
                  :max="userInfoStore.article.max"
                  :max-pages="userInfoStore.article.maxpages"
                  gutter="sm"
                  color="grey-9"
                  active-color="primary"
                  direction-links
                  unelevated
                  boundary-numbers
                />
              </q-page-scroller>
            </q-tab-panel>

            <!-- 最热 -->
            <q-tab-panel
              :name="1"
              :class="useScreenStore.user.contentGap"
              class="row no-padding"
            >
              <div
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                v-for="i in 20"
                :key="i + 'user-card'"
              >
                <q-card
                  square
                  flat
                  :class="{ 'bg-transparent': useScreenStore.isAdminTitle }"
                >
                  <q-card-section
                    horizontal
                    v-ripple:grey
                    class="cursor-pointer"
                  >
                    <q-card-section class="flex flex-center q-pb-xs">
                      <!-- :src="it.img" -->
                      <q-img
                        src="/testImg/road-1072821_1920.jpg"
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
                      >
                        标题标题标题标题标题标题标题标题标题标题
                      </q-item-label>
                      <q-item-label class="text-body2 q-pt-sm" :lines="3">
                        <!-- {{ it.content }} -->
                        内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                      </q-item-label>
                    </q-card-section>
                  </q-card-section>

                  <q-card-actions
                    :class="{ 'text-grey': !useScreenStore.isAdminTitle }"
                    class="text-caption q-pt-none"
                  >
                    <!-- 发布日期 -->
                    <q-item-label class="flex items-center q-mr-md q-mt-xs">
                      <q-icon name="o_access_time" />&nbsp;2024/1/1
                    </q-item-label>

                    <!-- 浏览 -->
                    <q-item-label class="flex items-center q-mr-md"
                      ><q-icon name="o_remove_red_eye" />&nbsp;23
                    </q-item-label>

                    <!-- 点赞 -->
                    <q-item-label class="flex items-center q-mr-md">
                      <q-icon name="r_favorite_border" />&nbsp;23
                    </q-item-label>

                    <!-- 收藏 -->
                    <q-item-label class="flex items-center q-mr-md">
                      <q-icon size="1.4em" name="r_star_border" />&nbsp;1
                    </q-item-label>

                    <!-- 评论 -->
                    <q-item-label class="flex items-center">
                      <q-icon name="o_mode_comment" />&nbsp;0
                    </q-item-label>

                    <q-space />
                    <q-btn flat class="q-mt-xs" size="sm" icon="r_more_horiz">
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
                  </q-card-actions>
                </q-card>
              </div>

              <!-- 热门分页 -->
              <q-page-scroller
                position="bottom"
                :scroll-offset="100"
                :duration="10"
                :offset="[0, 8]"
              >
                <q-pagination
                  :size="Screen.gt.xs ? 'lg' : '1em'"
                  v-model="userInfoStore.article.hotCurPage"
                  :max="userInfoStore.article.max"
                  :max-pages="userInfoStore.article.maxpages"
                  gutter="sm"
                  color="grey-9"
                  active-color="primary"
                  direction-links
                  unelevated
                  boundary-numbers
                />
              </q-page-scroller>
            </q-tab-panel>
          </q-tab-panels>
        </q-tab-panel>

        <!-- 音乐  -->
        <q-tab-panel
          name="music"
          :style="{ 'margin-bottom': Screen.gt.xs ? '58px' : '46px' }"
          class="no-padding"
        >
          <!-- 最新 | 最热 -->
          <q-tabs
            dense
            align="left"
            v-model="userInfoStore.music.sort"
            active-color="primary"
            indicator-color="transparent"
            breakpoint="xs"
            inline-label
            :active-class="userInfoStore.music.sort ? 'text-red' : 'text-green'"
          >
            <q-tab :name="0" icon="r_access_time" label="新" />
            <q-tab :name="1" icon="r_whatshot" label="热" />
          </q-tabs>

          <q-tab-panels
            v-model="userInfoStore.music.sort"
            :class="{ 'bg-transparent': useScreenStore.isAdminTitle }"
          >
            <!-- 最新 -->
            <q-tab-panel
              :name="0"
              :class="useScreenStore.user.contentGap"
              class="row no-padding"
            >
              <div
                v-for="i in 20"
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 row"
                :class="useScreenStore.user.showBtHeize"
              >
                <!-- active -->
                <q-item clickable v-ripple class="col-11 q-pr-none">
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
                      <!-- 置顶 -->
                      <q-badge
                        color="blue-grey-8"
                        v-if="i === 1"
                        label="T1"
                        class="q-mr-xs"
                      />
                      <q-badge
                        color="blue-grey-6"
                        v-if="i === 2"
                        label="T2"
                        class="q-mr-xs"
                      />
                      <q-badge
                        color="blue-grey-4"
                        v-if="i === 3"
                        label="T3"
                        class="q-mr-xs"
                      />
                      标题标题标题标题标题标题标题标题标题标题
                    </q-item-label>

                    <!-- 发布信息 -->
                    <q-item-label
                      :class="{
                        'text-grey': !useScreenStore.isAdminTitle,
                        'text-white': useScreenStore.isAdminTitle,
                      }"
                      class="flex text-caption no-wrap q-pt-xs"
                    >
                      <!-- 发布日期 -->
                      <span class="flex items-center q-mr-md q-mt-xs">
                        <q-icon name="o_access_time" />&nbsp;2024/1/1
                      </span>

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
                  :color="useScreenStore.isAdminTitle ? '' : 'grey'"
                  class="col"
                  flat
                  dense
                  icon="r_more_vert"
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
              <!-- 音乐最新分页 -->
              <q-page-scroller
                position="bottom"
                :scroll-offset="100"
                :duration="10"
                :offset="[0, 8]"
              >
                <q-pagination
                  :size="Screen.gt.xs ? 'lg' : '1em'"
                  v-model="userInfoStore.music.newCurPage"
                  :max="userInfoStore.music.max"
                  :max-pages="userInfoStore.music.maxpages"
                  gutter="sm"
                  color="grey-9"
                  active-color="primary"
                  direction-links
                  unelevated
                  boundary-numbers
                />
              </q-page-scroller>
            </q-tab-panel>

            <!-- 音乐最热 -->
            <q-tab-panel
              :name="1"
              :class="useScreenStore.user.contentGap"
              class="row no-padding"
            >
              <div
                v-for="i in 20"
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 row"
                :class="useScreenStore.user.showBtHeize"
              >
                <!-- active -->
                <q-item clickable v-ripple class="col-11 q-pr-none">
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
                      标题标题标题标题标题标题标题标题标题标题
                    </q-item-label>

                    <!-- 发布信息 -->
                    <q-item-label
                      :class="{
                        'text-grey': !useScreenStore.isAdminTitle,
                        'text-white': useScreenStore.isAdminTitle,
                      }"
                      class="flex text-caption no-wrap q-pt-xs"
                    >
                      <!-- 发布日期 -->
                      <span class="flex items-center q-mr-md q-mt-xs">
                        <q-icon name="o_access_time" />&nbsp;2024/1/1
                      </span>

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
                  :color="useScreenStore.isAdminTitle ? '' : 'grey'"
                  class="col"
                  flat
                  dense
                  icon="r_more_vert"
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

              <!-- 音乐最热分页 -->
              <q-page-scroller
                position="bottom"
                :scroll-offset="100"
                :duration="10"
                :offset="[0, 8]"
              >
                <q-pagination
                  :size="Screen.gt.xs ? 'lg' : '1em'"
                  v-model="userInfoStore.music.hotCurPage"
                  :max="userInfoStore.music.max"
                  :max-pages="userInfoStore.music.maxpages"
                  gutter="sm"
                  color="grey-9"
                  active-color="primary"
                  direction-links
                  unelevated
                  boundary-numbers
                />
              </q-page-scroller>
            </q-tab-panel>
          </q-tab-panels>
        </q-tab-panel>

        <!-- 收藏 -->
        <q-tab-panel
          name="star"
          :style="{ 'margin-bottom': Screen.gt.xs ? '58px' : '46px' }"
          class="no-padding"
        >
          <!-- 0 内容 | 1 音乐  | 新建收藏夹-->
          <div class="row">
            <q-tabs
              class="col"
              dense
              align="left"
              v-model="userInfoStore.star.activeModel"
              active-color="primary"
              indicator-color="transparent"
              breakpoint="xs"
              inline-label
              active-class="primary"
            >
              <q-tab :name="0" icon="r_article" label="内容" />
              <q-tab :name="1" icon="r_music_note" label="音乐" />
            </q-tabs>

            <q-space />
            <!-- 新建收藏夹 -->
            <q-btn
              class="col-5"
              dense
              flat
              icon="r_add"
              @click="useGloabStore.openStarModel"
              label="新建收藏夹"
            />
          </div>

          <q-tab-panels
            v-model="userInfoStore.star.activeModel"
            :class="{ 'bg-transparent': useScreenStore.isAdminTitle }"
            @transition="userInfoStore.starTransition"
          >
            <!-- 内容收藏 -->
            <q-tab-panel
              :name="0"
              :class="useScreenStore.user.contentGap"
              class="row no-padding overflow-hidden"
              ref="dragContentEl"
            >
              <transition-group
                @before-enter="onBeforeEnter"
                @enter="onEnter"
                @leave="onLeave"
                v-if="userInfoStore.star.articleData.length"
              >
                <div
                  v-for="(it, i) in userInfoStore.star.articleData"
                  class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 drag-item"
                  :class="useScreenStore.user.showBtHeize"
                  :key="it.id"
                >
                  <q-item class="no-padding">
                    <!-- 拖拽句柄-->
                    <q-item-section side class="no-padding">
                      <q-btn
                        :class="{
                          'text-grey': !useScreenStore.isAdminTitle,
                          'text-white': useScreenStore.isAdminTitle,
                        }"
                        icon="r_drag_handle"
                        flat
                        class="fit drag-handle"
                      />
                    </q-item-section>

                    <!-- 内容 -->
                    <q-item-section>
                      <q-item
                        clickable
                        @click="userInfoStore.openStarDiaModel"
                        class="full-width q-pl-none"
                      >
                        <q-item-section top avatar>
                          <!-- 封面 -->
                          <q-avatar
                            v-if="it.img && it.img.length"
                            rounded
                            size="5.5em"
                          >
                            <q-img
                              :src="it.img"
                              class="rounded-borders"
                              ratio="1"
                            >
                              <template #loading>
                                <q-spinner-cube color="primary" size="xs" />
                              </template>
                            </q-img>
                          </q-avatar>
                          <q-avatar
                            v-else
                            rounded
                            size="5.5em"
                            icon="r_star_border"
                            text-color="grey"
                          />
                        </q-item-section>

                        <q-item-section class="items-start">
                          <q-item-label lines="3">
                            {{ it.title }}
                          </q-item-label>

                          <q-item-label
                            class="flex no-wrap text-caption q-pt-xs"
                            :class="{
                              'text-grey': !useScreenStore.isAdminTitle,
                              'text-white': useScreenStore.isAdminTitle,
                            }"
                          >
                            <!-- 收藏的所有音乐数量 -->
                            <span class="flex items-center q-mr-md">
                              × {{ it.tags.length }}
                            </span>

                            <!-- 创建日期 -->
                            <!-- <span class="flex items-center q-mr-md">
                            <q-icon name="o_access_time" />
                            {{ it.createDate }}
                          </span> -->

                            <!-- 被收藏的数量 -->
                            <span class="flex items-center q-mr-md">
                              <q-icon size="1.4em" name="r_star" />
                              {{ it.stars.length }}
                            </span>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-item-section>

                    <!-- 操作按钮 -->
                    <q-item-section side class="no-padding">
                      <q-btn
                        :class="{
                          'text-grey': !useScreenStore.isAdminTitle,
                          'text-white': useScreenStore.isAdminTitle,
                        }"
                        flat
                        class="fit q-pr-md"
                        size="sm"
                        dense
                        icon="r_more_vert"
                      >
                        <q-menu>
                          <q-list style="min-width: 100px">
                            <q-item
                              clickable
                              v-close-popup
                              @click="useGloabStore.openStarModel(it, true)"
                            >
                              <q-item-section side>
                                <q-icon name="r_create" size="sm" />
                              </q-item-section>
                              <q-item-section> 编辑 </q-item-section>
                            </q-item>

                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                useGloabStore.delCollection(
                                  it.id,
                                  userInfoStore.star.activeModel
                                )
                              "
                            >
                              <q-item-section side>
                                <q-icon name="o_delete" size="sm" />
                              </q-item-section>
                              <q-item-section> 删除 </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </div>
              </transition-group>
              <q-avatar v-else size="15rem" class="q-mx-auto block">
                <img src="@/assets/styles/noneStyle/starNone.svg" />
              </q-avatar>
            </q-tab-panel>

            <!-- 音乐收藏 -->
            <q-tab-panel
              :name="1"
              :class="useScreenStore.user.contentGap"
              class="row q-py-none"
              ref="dragContentEl"
            >
              <transition-group
                @before-enter="onBeforeEnter"
                @enter="onEnter"
                @leave="onLeave"
                v-if="userInfoStore.star.musicData.length"
              >
                <div
                  v-for="(it, i) in userInfoStore.star.musicData"
                  class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 drag-item"
                  :class="useScreenStore.user.showBtHeize"
                  :key="it.id"
                >
                  <q-item class="no-padding">
                    <!-- 拖拽句柄-->
                    <q-item-section side class="no-padding">
                      <q-btn
                        :class="{
                          'text-grey': !useScreenStore.isAdminTitle,
                          'text-white': useScreenStore.isAdminTitle,
                        }"
                        icon="r_drag_handle"
                        flat
                        class="fit drag-handle"
                      />
                    </q-item-section>

                    <!-- 内容 -->
                    <q-item-section>
                      <q-item
                        clickable
                        @click="userInfoStore.openStarDiaModel"
                        class="full-width q-pl-none"
                      >
                        <q-item-section top avatar>
                          <!-- 封面 -->
                          <q-avatar
                            rounded
                            size="5.5em"
                            v-if="it.img && it.img.length"
                          >
                            <q-img
                              :src="it.img"
                              class="rounded-borders"
                              ratio="1"
                            >
                              <template #loading>
                                <q-spinner-cube color="primary" size="xs" />
                              </template>
                            </q-img>
                          </q-avatar>
                          <q-avatar
                            v-else
                            rounded
                            size="5.5em"
                            icon="r_star_border"
                            text-color="grey"
                          />
                        </q-item-section>

                        <q-item-section class="items-start">
                          <q-item-label lines="3">
                            {{ it.title }}
                          </q-item-label>

                          <q-item-label
                            class="flex no-wrap text-caption q-pt-xs"
                            :class="{
                              'text-grey': !useScreenStore.isAdminTitle,
                              'text-white': useScreenStore.isAdminTitle,
                            }"
                          >
                            <!-- 收藏的所有音乐数量 -->
                            <span class="flex items-center q-mr-md">
                              × {{ it.tags.length }}
                            </span>

                            <!-- 被收藏的数量 -->
                            <span class="flex items-center q-mr-md">
                              <q-icon size="1.4em" name="r_star" />
                              {{ it.stars.length }}
                            </span>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-item-section>

                    <!-- 操作按钮 -->
                    <q-item-section side class="no-padding">
                      <q-btn
                        :class="{
                          'text-grey': !useScreenStore.isAdminTitle,
                          'text-white': useScreenStore.isAdminTitle,
                        }"
                        flat
                        class="fit q-pr-md"
                        size="sm"
                        dense
                        icon="r_more_vert"
                      >
                        <q-menu>
                          <q-list style="min-width: 100px">
                            <q-item clickable v-close-popup>
                              <q-item-section side>
                                <q-icon name="r_create" size="sm" />
                              </q-item-section>
                              <q-item-section> 编辑 </q-item-section>
                            </q-item>

                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                useGloabStore.delCollection(
                                  it.id,
                                  userInfoStore.star.activeModel
                                )
                              "
                            >
                              <q-item-section side>
                                <q-icon name="o_delete" size="sm" />
                              </q-item-section>
                              <q-item-section> 删除 </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </div>
              </transition-group>

              <q-avatar v-else size="15rem" class="q-mx-auto block">
                <img src="@/assets/styles/noneStyle/starNone.svg" />
              </q-avatar>
            </q-tab-panel>
          </q-tab-panels>
        </q-tab-panel>

        <!-- 审核中 -->
        <q-tab-panel
          name="shenHe"
          :style="{ 'margin-bottom': Screen.gt.xs ? '58px' : '46px' }"
          class="q-pa-none row"
          :class="useScreenStore.user.contentGap"
        >
          <div
            v-for="i in 20"
            class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 row"
            :class="useScreenStore.user.showBtHeize"
          >
            <!-- active -->
            <q-item clickable v-ripple class="col q-pr-none">
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
                  标题标题标题标题标题标题标题标题标题标题
                </q-item-label>

                <!-- 发布信息 -->
                <q-item-label
                  :class="{
                    'text-grey': !useScreenStore.isAdminTitle,
                    'text-white': useScreenStore.isAdminTitle,
                  }"
                  class="text-caption q-pt-xs"
                >
                  <!-- 发布日期 -->
                  <span class="flex items-center">
                    <q-icon name="o_access_time" />&nbsp;2024/1/1</span
                  >
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- tab悬浮导航-->
    <q-page-sticky position="top" v-show="tabsHide">
      <q-card square :style="{ width: fixedTabsWidth }">
        <q-tabs
          :inline-label="useScreenStore.user.tabInline"
          :align="useScreenStore.user.tabAlign"
          v-model="userInfoStore.tabMenuModel"
          @update:model-value="userInfoStore.TabsCheckEv"
        >
          <q-tab
            name="article"
            icon="r_library_books"
            label="内容"
            class="text-purple-12"
          />
          <q-tab
            name="music"
            icon="r_library_music"
            label="音乐"
            class="text-light-blue"
          />
          <q-tab
            name="star"
            icon="r_star_border"
            label="收藏"
            class="text-teal"
          />
          <q-tab
            name="shenHe"
            icon="r_security"
            label="审核中"
            class="text-deep-orange"
          />
        </q-tabs>
      </q-card>
    </q-page-sticky>
    <!-- dialog -->
    <q-dialog
      v-model="user.dialogModel"
      transition-show="rotate"
      transition-hide="rotate"
      @hide="dialogHide"
    >
      <!-- 背景 -->
      <q-card>
        <!-- 背景 | 头像 -->
        <q-card-section v-if="user.cltType === 0 || user.cltType === 1">
          <q-responsive :ratio="4 / 3" style="width: 80vw">
            <q-img :src="user.url" fit="contain" v-if="!user.fileModel">
              <template v-slot:loading>
                <q-spinner-facebook color="primary" />
              </template>
            </q-img>

            <cropper
              v-else
              :url="user.url"
              :aspectRatio="user.aspectRatio"
              @clip-img="clipImg"
            />
          </q-responsive>

          <!--  图片上传-->
          <div class="column q-gutter-y-md q-mt-md">
            <q-file
              outlined
              color="primary"
              label-color="primary"
              accept="image/*"
              v-model="user.fileModel"
              label="选择图片"
              @update:model-value="upFile"
              @clear="clearFile"
              clearable
            />

            <q-btn
              color="primary"
              v-show="user.fileModel ? true : false"
              unelevated
              :loading="user.uploading"
              label="上传"
              @click="upSexOrDescribeOrAvatarOrBg"
            />

            <q-btn
              color="primary"
              class="xs"
              unelevated
              outline
              label="取消"
              @click="user.dialogModel = false"
            />
          </div>
        </q-card-section>

        <!--2 昵称 + 性别 |  3简介-->
        <q-card-section v-if="user.cltType === 2 || user.cltType === 3">
          <q-card-section>
            <div class="text-h6 light-show">{{ user.upTitle }}</div>
          </q-card-section>

          <!-- 昵称 + 性别 -->
          <q-card-section class="q-pt-none">
            <div v-if="user.cltType === 2">
              <q-input
                v-model="user.userName"
                autofocus
                :rules="[userNameRules]"
              >
                <template v-slot:before>
                  <div class="text-body1">昵称:</div>
                </template>
              </q-input>

              <q-field color="primary">
                <template v-slot:before>
                  <div class="text-body1">性别:</div>
                </template>

                <template v-slot:control>
                  <q-radio
                    v-model="user.sex"
                    checked-icon="female"
                    unchecked-icon="female"
                    :class="user.sex === 1 ? 'text-blue' : ''"
                    color="blue"
                    :val="1"
                    label="男"
                    class="q-mr-md text-body1"
                  />
                  <q-radio
                    v-model="user.sex"
                    checked-icon="male"
                    unchecked-icon="male"
                    class="text-body1"
                    :class="user.sex === 0 ? 'text-pink' : ''"
                    color="pink"
                    :val="0"
                    label="女"
                  />
                </template>
              </q-field>
            </div>

            <!-- 简介 -->
            <q-input
              outlined
              :maxlength="200"
              counter
              type="textarea"
              v-else
              v-model="user.describe"
              autofocus
              autogrow
              :rules="[describeRule]"
            />
          </q-card-section>

          <q-card-actions>
            <q-btn
              class="full-width"
              label="修改"
              unelevated
              color="primary"
              @click="upSexOrDescribeOrAvatarOrBg"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-resize-observer @resize="onResize" />
  </q-page>
</template>

<script setup>
import useUserInfoStore, { dragContentEl } from "../stores/userInfo";
import { inject, computed, ref } from "vue";
import { Screen } from "quasar";
import MusicPlayAnimate from "../components/music/MusicPlayAnimate.vue";
import {
  user,
  userClk,
  upFile,
  clearFile,
  clipImg,
  dialogHide,
  upSexOrDescribeOrAvatarOrBg,
} from "../utils/users.js";
import Cropper from "../components/Cropper.vue";
import { userNameRules, describeRule } from "../utils/rules.js";
import gloabStore from "../stores/starUpGxStrore";
import screenSizeCfgStore from "../stores/screenSizeCfgStore";
import { onLeave, onEnter, onBeforeEnter } from "../common/transition/radm";

const useScreenStore = screenSizeCfgStore();
const useGloabStore = gloabStore();
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

/**
 * 内容
 */
const pageNation = ref([1, 1, 1]);
const tabsHide = ref(true);
let fixedTabsWidth = ref("0px"); // 悬浮tab宽度

const onResize = (s) => (fixedTabsWidth.value = s.width + "px");

const onIntersection = (val) => {
  tabsHide.value = !val.isIntersecting;
};

const tabModel = ref("mails");

const gapSize = inject("gapSize");

const userInfoStore = useUserInfoStore();

const userAdminClass = computed(() => {
  // >0
  if (userInfoStore.role.role === 0) {
    return "bg-transparent user-admin text-white";
  }

  return "";
});
</script> 

<style scoped lang="sass">
.user-top
  border-radius: 20px 20px 0 0

.user-admin
  background: rgba(0, 0, 0, 0.4)

.user-admin-tab-bar
  background: rgba(0, 0, 0, 0.65)

#bg
  background-repeat: no-repeat
  background-attachment: fixed
  background-position: center
  background-size: cover
  position: fixed
  top: 0
  left: 0
  display: block

.draging-show
  opacity: 1 !important

.draging-hide
  opacity: 0 !important
</style>