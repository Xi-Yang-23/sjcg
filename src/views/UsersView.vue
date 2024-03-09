<template>
  <q-page ref="page">
    <!-- 背景 -->
    <q-img
      :src="userInfoStore.bg"
      height="65%"
      width="100%"
      id="bg"
      class="cursor-pointer"
      @click="userClk(0)"
    >
      <template v-slot:loading>
        <q-spinner-facebook color="primary" />
      </template>
    </q-img>

    <div style="margin-top: 20vh">
      <!-- 头像 -->
      <q-avatar
        size="60px"
        class="absolute cursor-pointer"
        style="z-index: 1"
        :style="{ transform: `translate(${gapSize.pix}, -50%)` }"
        @click="userClk(1)"
      >
        <!-- 用户认证 -->
        <q-icon size="sm" class="absolute-bottom-right z-top">
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
            <q-spinner-facebook size="sm" color="primary" />
          </template>
        </q-img>
      </q-avatar>

      <!-- 用户信息 -->
      <q-card class="user-top" :class="userAdminClass" flat>
        <q-card-section>
          <div style="margin-left: 60px" class="flex">
            <div>
              <q-btn unelevated>
                <span class="text-body1">关注</span>
                <div class="text-h6 q-pl-xs">0</div>
              </q-btn>
            </div>
            <q-separator vertical :dark="userInfoStore.role.role > 0" inset />
            <div>
              <q-btn unelevated>
                <span class="text-body1">粉丝</span>
                <div class="text-h6 q-pl-xs">12</div>
              </q-btn>
            </div>
            <q-separator vertical :dark="userInfoStore.role.role > 0" inset />
            <q-btn unelevated>
              <span class="text-body1">获赞</span>
              <div class="text-h6 q-pl-xs">32</div>
            </q-btn>
          </div>
          <div class="flex column">
            <!-- 用户名 -->
            <div class="text-h6 ellipsis cursor-pointer" @click="userClk(2)">
              {{ userInfoStore.userName }}
            </div>

            <!-- 用户基本信息 -->
            <div class="flex items-center q-gutter-x-sm">
              <q-badge label="审核员" />
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

              <!-- 状态 在线　green-13  |离线 blue-grey-->
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
          {{ userInfoStore.describe }}
        </q-card-section>
      </q-card>

      <!-- tab -->
      <q-card square flat v-intersection="onIntersection">
        <q-tabs
          :align="'justify'"
          v-model="tabModel"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="mails" label="内容" />
          <q-tab name="alarms" label="音乐" />
          <q-tab name="movies" label="收藏" />
          <q-tab name="isyes" label="审核中" />
        </q-tabs>
      </q-card>

      <!-- tab内容 -->
      <q-tab-panels v-model="tabModel">
        <!-- 内容 -->
        <q-tab-panel
          name="mails"
          class="q-pa-none"
          :style="{ 'margin-bottom': Screen.gt.xs ? '58px' : '46px' }"
        >
          <q-card flat square v-for="i in 20">
            <q-item clickable v-ripple>
              <!-- 贴子封面 -->
              <q-item-section avatar>
                <q-img
                  src="https://cdn.quasar.dev/img/boy-avatar.png"
                  width="100px"
                  :ratio="4 / 3"
                  class="rounded-borders"
                >
                  <template v-slot:loading>
                    <q-spinner-gears size="md" color="primary" />
                  </template>
                </q-img>
              </q-item-section>

              <!-- 贴子内容+标题 -->
              <q-item-section>
                <q-item-label
                  :class="title"
                  class="text-weight-medium"
                  :lines="2"
                >
                  <span> 贴子 标题 </span>
                </q-item-label>

                <q-item-label :lines="3" class="text-body2 q-pt-sm">
                  贴子内容
                </q-item-label>
              </q-item-section>
            </q-item>

            <!-- 贴子信息-->
            <div class="flex text-grey">
              <!-- 发布日期 -->
              <div class="flex items-center q-pl-md">
                <q-icon name="access_time" /> 2023/12/3
              </div>

              <q-space />

              <!--点赞信息 -->
              <div class="flex q-gutter-x-md items-center">
                <span><q-icon name="favorite_border" /> 12 </span>
                <span><q-icon name="o_remove_red_eye" /> 2332 </span>

                <!-- 更多 -->
                <q-btn
                  class="flex-end"
                  flat
                  icon="more_horiz"
                  no-caps
                  size="sm"
                />
              </div>
            </div>
            <q-separator />
          </q-card>

          <!-- 分页 -->
          <q-page-scroller
            position="bottom"
            :scroll-offset="100"
            :duration="10"
            :offset="[0, 8]"
          >
            <q-pagination
              :size="Screen.gt.xs ? 'lg' : '1em'"
              v-model="pageNation[0]"
              :max="30"
              :max-pages="6"
              gutter="sm"
              color="grey-9"
              active-color="primary"
              direction-links
              unelevated
              boundary-numbers
            />
          </q-page-scroller>
        </q-tab-panel>

        <!-- 音乐  :class="'q-mb-' + gapSize.name"-->
        <q-tab-panel
          name="alarms"
          :style="{ 'margin-bottom': Screen.gt.xs ? '40px' : '30px' }"
        >
          <q-card flat v-for="(it, i) in 20" :key="i + 'list-card'">
            <div class="row">
              <q-item
                clickable
                v-ripple
                :active="activeMusicIndex === i"
                @click="musicListCk(i, it)"
                class="col-10 q-pr-none"
              >
                <q-item-section avatar>
                  <q-avatar rounded>
                    <q-img
                      src="https://cdn.quasar.dev/img/boy-avatar.png"
                      :ratio="1"
                      v-show="activeMusicIndex !== i"
                    >
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
                  <q-item-label :lines="1" :class="title">标题</q-item-label>

                  <q-item-label :lines="1" caption>
                    <q-badge
                      transparent
                      :label="'3:' + i"
                      color="primary"
                      class="q-mr-sm"
                    />
                    作者
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-btn
                class="col-2 q-pl-none"
                flat
                color="grey"
                icon="tmore_vert"
              />
            </div>
            <q-separator />
          </q-card>
          <!-- 分页 -->
          <q-page-scroller
            position="bottom"
            :scroll-offset="100"
            :duration="10"
            :offset="[0, 8]"
          >
            <q-pagination
              :size="Screen.gt.xs ? 'lg' : '1em'"
              v-model="pageNation[0]"
              :max="30"
              :max-pages="6"
              gutter="sm"
              color="grey-9"
              active-color="primary"
              direction-links
              unelevated
              boundary-numbers
            />
          </q-page-scroller>
        </q-tab-panel>

        <!-- 收藏 -->
        <q-tab-panel name="movies">
          <div>
            <q-item clickable v-ripple class="q-px-none">
              <q-item-section avatar class="relative-position">
                <q-avatar size="90px" rounded>
                  <q-img src="https://cdn.quasar.dev/img/boy-avatar.png">
                    <template v-slot:loading>
                      <q-spinner-cube color="primary" size="sm" />
                    </template>
                  </q-img>
                </q-avatar>
                <q-badge
                  color="primary"
                  class="absolute-bottom-left"
                  label="x3"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label :class="title">
                  标题标题标题标题标题标题标题标题
                  标题标题标题标题标题标题标题标题
                </q-item-label>

                <q-item-label caption class="q-pt-md">
                  <q-icon name="access_time" /> 2023/2/3
                </q-item-label>
              </q-item-section>
            </q-item>

            <div class="flex items-center row">
              <!-- 收藏创建者 -->
              <q-btn
                :align="'left'"
                flat
                class="text-weight-regular col-6 text-grey-7 q-pl-none"
                no-caps
              >
                <div class="ellipsis">
                  <q-avatar size="sm">
                    <q-img src="https://cdn.quasar.dev/img/boy-avatar.png">
                      <template v-slot:loading>
                        <q-spinner-ball color="primary" size="xs" />
                      </template>
                    </q-img>
                  </q-avatar>
                  创建者 创建者 创建者
                </div>
              </q-btn>

              <q-space />
              <!-- 更多 -->
              <q-btn flat color="grey" icon="more_horiz" />

              <!-- star_border star -->
              <!-- orange grey -->
              <q-btn flat dense color="grey" icon="star_border" label="1" />

              <!-- favorite_border favorite red grey -->
              <q-btn flat dense color="red" icon="favorite" label="22" />
            </div>
            <q-separator />
          </div>
        </q-tab-panel>

        <!-- 审核中 -->
        <q-tab-panel name="isyes">
          <q-list separator>
            <q-item clickable v-ripple class="q-px-none" v-for="i in 13">
              <q-item-section avatar>
                <q-avatar size="60px" rounded>
                  <q-img src="https://cdn.quasar.dev/img/boy-avatar.png">
                    <template v-slot:loading>
                      <q-spinner-clock color="primary" size="sm" />
                    </template>
                  </q-img>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label :class="title" lines="1">
                  标题标题标题标题标题标题标题标题
                  标题标题标题标题标题标题标题标题
                </q-item-label>

                <q-item-label lines="1">
                  内容内容内容内容内容内容内容 内容内容内容内容内容内容内容
                  内容内容内容内容内容内容内容
                </q-item-label>

                <q-item-label class="q-pt-xs text-grey">
                  2023/1/23 23:23
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- tab悬浮导航-->
    <q-page-sticky position="top" v-show="tabsHide">
      <q-card square :style="{ width: fixedTabsWidth }">
        <q-tabs
          :align="'justify'"
          v-model="tabModel"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="mails" label="内容" />
          <q-tab name="alarms" label="音乐" />
          <q-tab name="movies" label="收藏" />
          <q-tab name="isyes" label="审核中" />
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
import useUserInfoStore from "../stores/userInfo";
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

/**
 * 音乐
 */
const title = computed(() => {
  if (Screen.gt.xs) return "text-h6";
  return "text-body1";
});

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
const page = ref(),
  tabsHide = ref(true);
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
  backdrop-filter: blur(5px)

#bg
  background-repeat: no-repeat
  background-attachment: fixed
  background-position: center
  background-size: cover
  position: fixed
  top: 0
  left: 0
  display: block
</style>