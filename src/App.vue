<template>
  <q-layout view="hHh Lpr lff" container class="window-height">
    <q-header reveal :class="themeStore.toolBarColor">
      <q-toolbar>
        <q-btn
          :color="drawer ? 'primary' : ''"
          flat
          @click="drawer = !drawer"
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
              external-label
              label-position="left"
              push
              color="positive"
              icon="music_note"
              label="音乐"
              anchor="start"
            />

            <q-fab-action
              external-label
              label-position="left"
              push
              color="secondary"
              icon="translate"
              label="博文"
              :to="'/article/ctedit'"
              anchor="start"
            />

            <q-fab-action
              external-label
              label-position="left"
              push
              color="accent"
              icon="ondemand_video"
              label="视频"
              anchor="start"
            />
            <q-fab-action
              external-label
              label-position="left"
              push
              color="yellow"
              icon="image"
              label="图片"
              anchor="start"
            />
            <q-fab-action
              external-label
              label-position="left"
              push
              color="blue-grey"
              icon="image"
              label="草稿"
              anchor="start"
            />
          </q-fab>
        </div>

        <!-- 登录 -->
        <q-btn
          v-else
          color="primary"
          unelevated
          label="登录"
          @click="useUserInfo.loginAlert = true"
        />
      </q-toolbar>
    </q-header>

    <!-- 小屏底部导航 -->
    <q-footer :class="themeStore.toolBarColor" class="lt-sm" reveal>
      <q-tabs
        dense
        :align="'justify'"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab
          v-for="(tabsItem, i) in tabsMenu"
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
        <keep-alive>
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
  </q-layout>
</template>
 

<script setup>
import { ref, provide, computed, onBeforeMount, onMounted } from "vue";
import { useQuasar } from "quasar";
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

const useUserInfo = useUserInfoStore();
const themeStore = theme();

const $q = useQuasar(),
  tabsMenu = ref();

const searchText = ref("");
const addContent = ref(false);
const drawer = ref(false);
const placeholderText = ref("奥迪RS7奥迪RS7奥迪RS7");
// 默认菜单
const defaultMenu = [
  {
    to: "/home",
    icon: "home",
    label: "首页",
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
];

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
  // sse();
  // const { email, token } = useUserInfo;
  // if (token && email) {
  //   const nt = new Date().getTime();
  //   const maRes = await menuAndAuth({
  //     nt,
  //     sign: md5(email + nt + "menuAuth2024/3/5 21:35").toLocaleUpperCase(),
  //   });
  //   if (maRes.statu === 200) {
  //     const { msg } = maRes,
  //       { role } = msg;
  //     tabsMenu.value = role.menu;
  //     return true;
  //   }
  // }
  // tabsMenu.value = defaultMenu;
});

provide("tabsMenu", tabsMenu);
provide("drawer", drawer);
provide("themeStore", themeStore);
provide("gapSize", gapSize);
</script>

<style lang="sass" scoped>
</style>

<!-- 全局sass -->
<style lang="sass">
@import url('./assets/styles/global.sass')
@import url('./assets/styles/musicPlay.sass')

.light-show
  border-left: solid 4px $primary
  padding-left: 8px

.body--light
  background: $grey-3

::-webkit-scrollbar-thumb:hover
  background: $grey-7
  cursor: pointer

//  定义轨道的宽高{height定义的是横向轨道的高，width定义的是垂直轨道的宽} 
::-webkit-scrollbar
  width: v-bind('$q.screen.gt.xs?"8px":"0"')
  background: v-bind('themeStore.dark?"black":"$grey-3"')

//  定义的轨道的样式
::-webkit-scrollbar-track
  background-color: v-bind('themeStore.dark?"$grey":"$grey-3"')

// 定义的滑块的样式 
::-webkit-scrollbar-thumb
  border-radius: 10px
  background-color: $grey
</style>
 
 