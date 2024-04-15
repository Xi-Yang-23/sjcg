<template>
  <!-- 评论区组件 v-if="propsComments.comments"-->
  <q-card square flat :class="commentClass.parent">
    <!-- 父级发布者信息 propsComments.comments.child--> 
    <q-item :class="commentClass.childClass" class="q-pb-none">
      <q-item-section top avatar>
        <q-avatar class="cursor-pointer" size="md">
          <q-img :src="propsComments.comments.userInfo.avatar" :ratio="1">
            <template v-slot:loading>
              <q-spinner-orbit color="primary" size="xs" />
            </template>
          </q-img>

          <!-- 认证徽章 -->
          <q-icon
            v-if="propsComments.comments.userInfo.authIcon"
            class="absolute-bottom-right ren-zheng"
            v-html="propsComments.comments.userInfo.authIcon"
          />
        </q-avatar>
      </q-item-section>

      <!-- 昵称 <q-badge color="grey" label="置顶" />-->
      <q-item-section>
        <q-item-label :lines="1" class="text-body2 text-grey-7">
          {{ propsComments.comments.userInfo.uName }}
        </q-item-label>

        <q-item-label class="flex q-gutter-x-sm text-grey">
          <!-- 称号 -->
          <q-badge
            v-if="propsComments.comments.userInfo.title"
            :style="{
              color: propsComments.comments.userInfo.title.labelColor,
              background: propsComments.comments.userInfo.title.bgColor,
            }"
            :label="propsComments.comments.userInfo.title.label"
          />

          <!-- ip -->
          <div class="text-caption flex items-center">
            <q-icon name="place" /><span class="">{{
              propsComments.comments.IP
            }}</span>
          </div>

          <div class="text-caption flex items-center">
            <!-- female男 女male -->
            <q-icon
              name="male"
              color="pink"
              v-if="propsComments.comments.userInfo.sex === 0"
            />
            <q-icon name="female" color="blue" v-else />
          </div>
        </q-item-label>
      </q-item-section>

      <!-- 点赞按钮   -->
      <q-item-section side class="no-padding">
        <q-btn
          @click="upReply(propsComments.comments)"
          :icon="propsComments.comments.isUp ? 'favorite' : 'favorite_border'"
          :color="propsComments.comments.isUp ? 'red' : 'grey'"
          flat
          size="12px"
          no-caps
          dense
        >
          <div class="text-center full-width">
            {{ propsComments.comments.up }}
          </div>
        </q-btn>
      </q-item-section>
    </q-item>

    <!-- 父级评论  -->
    <q-item
      :inset-level="1"
      clickable
      v-ripple
      @click.stop="commentClk($event, propsComments.comments)"
    >
      <!-- 评论 |  主题  -->
      <q-item-section :class="commentTheme.parentCommentTheme">
        <!-- 评论的文本 {{ itChidIt.msg.txt }}-->
        <q-item-label
          class="text-body1"
          v-html="propsComments.comments.msg.txt"
          v-if="propsComments.comments.msg.txt"
        >
        </q-item-label>

        <!-- 评论图  -->
        <div class="q-pt-sm" v-if="propsComments.comments.msg.img">
          <q-img
            :src="propsComments.comments.msg.img"
            :ratio="4 / 3"
            :width="replyImgSize"
            @click.stop="imgShowClick(propsComments.comments.msg.img)"
            class="rounded-borders cursor-pointer"
          >
            <template v-slot:loading>
              <q-spinner-clock color="primary" />
            </template>
          </q-img>
        </div>

        <!-- 发布时间 -->
        <q-item-label caption class="q-pt-sm sub-date text-grey no-margin">
          {{ propsComments.comments.date }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <transition-group
      appear
      enter-active-class="animated bounceInLeft slow"
      leave-active-class="animated backOutRight slow"
    >
      <!-- 子级评论  -->
      <div
        v-for="(itChidIt, childI) in propsComments.comments.child"
        :key="itChidIt.childId"
      >
        <q-card square flat v-if="itChidIt && !itChidIt.isDel">
          <!-- 子级评论发布者信息 -->
          <q-item class="q-pb-none" :inset-level="1">
            <q-item-section top avatar class="comment-child-avatar q-pr-sm"> 
              <q-avatar class="cursor-pointer" size="md">
                <q-img :src="itChidIt.userInfo.avatar" :ratio="1">
                  <template v-slot:loading>
                    <q-spinner-orbit color="primary" size="15px" />
                  </template>
                </q-img>

                <!-- 认证徽章 -->
                <q-icon
                  v-if="itChidIt.userInfo.authIcon"
                  class="absolute-bottom-right ren-zheng"
                  v-html="itChidIt.userInfo.authIcon"
                />
              </q-avatar>
            </q-item-section>

            <!-- 昵称 -->
            <q-item-section>
              <q-item-label :lines="1" class="text-body2 text-grey-7">
                {{ itChidIt.userInfo.uName }}
              </q-item-label>

              <!-- 称号  | ip  性别  -->
              <q-item-label class="flex q-gutter-x-sm text-grey">
                <!-- 称号 -->
                <q-badge
                  v-if="itChidIt.userInfo.title"
                  :style="{
                    color: itChidIt.userInfo.title.labelColor,
                    background: itChidIt.userInfo.title.bgColor,
                  }"
                  :label="itChidIt.userInfo.title.label"
                />

                <!-- ip -->
                <div class="text-caption flex items-center">
                  <q-icon name="place" /><span class="">{{ itChidIt.IP }}</span>
                </div>

                <div class="text-caption flex items-center">
                  <!-- female男 女male -->
                  <q-icon
                    name="male"
                    color="pink"
                    v-if="itChidIt.userInfo.sex === 0"
                  />
                  <q-icon name="female" color="blue" v-else />
                </div>
              </q-item-label>
            </q-item-section>

            <!-- 点赞按钮 -->
            <q-item-section side class="no-paddingr">
              <q-btn
                :icon="itChidIt.isUp ? 'favorite' : 'favorite_border'"
                :color="itChidIt.isUp ? 'red' : 'grey'"
                size="12px"
                no-caps
                flat
                dense
                @click="upReply(itChidIt)"
              >
                <div class="text-center full-width">{{ itChidIt.up }}</div>
              </q-btn>
            </q-item-section>
          </q-item>

          <!-- 子级评论文本  -->
          <q-item
            :inset-level="commentClass.childInsetLevel"
            clickable
            v-ripple
            @click.stop="commentClk($event, itChidIt)"
          >
            <q-item-section :class="itChidIt.theme">
              <!-- 回复的评论 -->
              <q-item-label
                class="text-body2 text-grey q-pb-sm"
                v-if="itChidIt.replyCommentMsg"
              >
                回复
                <q-btn
                  color="blue-6"
                  dense
                  flat
                  padding="none"
                  class="text-body2"
                  :to="itChidIt.replyCommentMsg.uid"
                  @click.stop="replyClk(itChidIt.replyCommentMsg)"
                  :label="itChidIt.replyCommentMsg.uName"
                />：
                <span
                  v-if="itChidIt.replyCommentMsg.msg.txt"
                  v-html="itChidIt.replyCommentMsg.msg.txt"
                ></span>

                <q-avatar
                  square
                  size="xs"
                  v-if="itChidIt.replyCommentMsg.msg.img"
                >
                  <q-img
                    :src="itChidIt.replyCommentMsg.msg.img"
                    spinner-color="primary"
                    spinner-size="xs"
                  />
                </q-avatar>
              </q-item-label>

              <!-- 评论的文本 {{ itChidIt.msg.txt }}-->
              <q-item-label
                class="q-px-none q-pb-none text-body1 no-margin"
                v-if="itChidIt.msg.txt"
                v-html="itChidIt.msg.txt"
              >
              </q-item-label>
              <!-- 评论图  -->
              <div class="q-pt-sm" v-if="itChidIt.msg.img">
                <q-img
                  :src="itChidIt.msg.img"
                  :ratio="4 / 3"
                  @click.stop="imgShowClick(itChidIt.msg.img)"
                  :width="replyImgSize"
                  class="rounded-borders cursor-pointer"
                >
                  <template v-slot:loading>
                    <q-spinner-clock color="primary" />
                  </template>
                </q-img>
              </div>

              <!-- 发布时间 -->
              <q-item-label
                caption
                class="q-pt-sm sub-date text-grey no-margin"
              >
                {{ itChidIt.date }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </transition-group>

    <!-- 评论展开按钮 1 加载状态 | -1 销毁按钮 | 0 正常显示-->
    <transition
      appear
      enter-active-class="animated bounceInLeft slow"
      leave-active-class="animated backOutRight slow"
    >
      <q-item
        class="relative-position open-comments"
        v-if="propsComments.comments.openCommentLoading !== -1"
      >
        <q-space />
        <q-btn
          :loading="propsComments.comments.openCommentLoading === 1"
          flat
          dense
          color="primary"
          icon-right="arrow_drop_down"
          @click.stop="openComment('展开评论')"
          label="展开回复"
        >
          <template v-slot:loading>
            <q-spinner-comment size="sm" color="primary" />...
          </template>
        </q-btn>
      </q-item>
    </transition>
  </q-card>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, reactive, ref } from "vue";
import {
  Screen,
  Dialog,
  QSpinnerComment,
  Notify,
  LoadingBar,
  debounce,
} from "quasar";
import useUserInfoStore from "../stores/userInfo.js";
import axios from "axios";
import {
  textAreaFoucusEnd,
  bigReplyCfg,
  replyInfo,
  textAreaEl,
} from "../common/reply";
const renderChildCommentCount = ref(0); //已渲染的子评论数量

const imgShow = inject("imgShow");

const propsComments = defineProps({
  comments: {
    type: Object,
    require: true,
  },

  /**
   * 加载子评论按钮状态
   * - -1 没有更多评论了
   * - 0 可点击状态
   * - 1 加载状态
   */
  openCommentLoading: {
    type: Number,
    default: 0,
  },
});


/**
 * - loadChildComments 加载评论
 * - delComment 删除评论
 */
const emit = defineEmits(["loadChildComments", "delComment", "commentReplyEv"]);

/**
 * 父主题
 */
const commentTheme = computed(() => {
  const { commentTheme } = propsComments.comments;
  let parentCommentTheme = ""; //父主题
  // 父主题
  if (commentTheme) {
    switch (commentTheme) {
      case "macDark":
        parentCommentTheme = "mac-dark";
        break;

      case "macLight":
        parentCommentTheme = "mac-light";
        break;
    }
  }

  return {
    parentCommentTheme,
  };
});
/**
 * 计算class
 */
const commentClass = computed(() => {
  const { child } = propsComments.comments;
  let parent = "",
    childClass = "";
  if (child && child.length > 0 && Screen.lt.sm) {
    parent = " comment-parent relative-position ";
    childClass = " comment-child ";
  }

  // 子评论发布者缩进
  let childInsetLevel = 1;

  if (Screen.gt.xs) {
    childInsetLevel = 2;
  }

  return {
    parent,
    childClass,
    childInsetLevel,
  };
});

/**
 * 展开评论
 */
const openComment = () => {
  /**
   * - sort 排序 0 按点赞量排序 | 1 按评论时间排序
   * - start 起始位置
   * - count 每次加载的子评论条数
   * - childCount 所有子评论数量
   */
  const getInfo = {
    sort: 1,
    start: propsComments.comments.child.length,
    count: 5,
    childCount: propsComments.comments.childCount,
    parentId: propsComments.comments.parentId,
    t: 1,
  };

  emit("loadChildComments", getInfo);
};

/**
 * 评论点击事件
 * - 双击 - 删除评论
 * - 单击 - 回复评论
 * @param {Object} data 评论的数据
 */
let clkCount = 0,
  timer = null;
const commentClk = (ev, data) => {
  clkCount++;
  const { msg, childId } = data,
    useUserInfo = useUserInfoStore(),
    { uid, role, token } = useUserInfo,
    { auth } = role;

  timer = setTimeout(async () => {
    const { txt, uid: subCOmentUid } = msg;
    clearTimeout(timer);

    // 双击
    if (clkCount >= 2) {
      // 没有登录 | 不是本人发布的评论
      // if (!token || subCOmentUid !== uid) return;

      // 角色 3,4有权限删除 100
      const authInfo = auth.find((val) => val === 100 || val === 4);

      const notCfg = {
        type: "warning",
        message: "无权操作",
        position: "top",
      };

      const isChildComment = childId ? true : false;

      if (authInfo) {
        // 角色操作
        Dialog.create({
          title: "请选择删除原因:",
          html: true,
          options: {
            type: "radio",
            model: "",
            isValid: (val) => val.length > 0,
            items: [
              { label: "广告、色情、违规等", value: "t1" },
              { label: "对喷、辱骂、不良言论、反政治等", value: "t2" },
            ],
          },
          message: txt,
          cancel: {
            flat: false,
            unelevated: true,
            label: "取消",
          },
          ok: {
            flat: true,
            unelevated: true,
            label: "确定",
          },
          color: "primary",
          transitionShow: "slide-right",
          transitionHide: "slide-right",
        }).onOk(async () => {
          LoadingBar.setDefaults({
            color: "blue",
            size: "10px",
            position: "top",
          });
          LoadingBar.start();
          const { data } = await axios("/api/comments", {
            params: {
              t: 2,
            },
          });
          // 角色删除评论

          //  0 删除失败 |  1 删除成功 |　-1 无权操作
          switch (data) {
            case 0:
              notCfg.message = "删除失败";
              notCfg.type = "negative";
              break;
            case 1:
              // 删除评论
              isChildComment
                ? emit("delComment", propsComments.comments.parentId, childId)
                : emit("delComment", propsComments.comments.parentId);

              notCfg.message = "删除成功";
              notCfg.type = "positive";
              break;
          }

          Notify.create(notCfg);
          LoadingBar.stop();
        });
      } else {
        // 本人操作
        Dialog.create({
          title: "你确定删除该评论吗?",
          html: true,
          message: txt,
          cancel: {
            flat: true,
            label: "确定",
            unelevated: true,
          },
          ok: {
            flat: false,
            unelevated: true,
            label: "取消",
          },
          focus: "ok",
          color: "primary",
          transitionShow: "slide-up",
          transitionHide: "slide-up",
        }).onCancel(async () => {
          // 发布者删除评论
          LoadingBar.setDefaults({
            color: "blue",
            size: "md",
            position: "top",
          });
          LoadingBar.start();
          const { data } = await axios("/api/comments", {
            params: {
              t: 2,
            },
          });

          //  0 删除失败 |  1 删除成功 |　-1 无权操作
          switch (data) {
            case 0:
              notCfg.message = "删除失败";
              notCfg.type = "negative";
              break;
            case 1:
              // 删除评论
              isChildComment
                ? emit("delComment", propsComments.comments.parentId, childId)
                : emit("delComment", propsComments.comments.parentId);

              notCfg.message = "删除成功";
              notCfg.type = "positive";
              break;
          }

          Notify.create(notCfg);
          LoadingBar.stop();
        });
      }
      return (clkCount = 0);
    }

    /**
     * !单击
     */

    //单击 |  回复评论
    replyInfo.placehodel = "回复 " + data.userInfo.uName;

    bigReplyCfg.showReply = true;

    if (Screen.lt.md) replyInfo.showReplyInput = true;

    await nextTick();
    textAreaEl.value.innerHTML = replyInfo.comments;

    if (Screen.lt.md && replyInfo.diaLogType === -1) {
      textAreaFoucusEnd();
      textAreaEl.value.focus();
    } else {
      textAreaFoucusEnd(true);
    }

    let parentData = null,
      childData = null;

    if (data.parentId) {
      parentData = data;
    } else {
      parentData = propsComments.comments;
      childData = data;
    }

    emit("commentReplyEv", parentData, childData);
    clkCount = 0;

    const clickEl = ev.target.parentElement;

    return clickEl.scrollIntoView({
      behavior: Screen.gt.sm ? "smooth" : "auto",
      block: "start",
      inline: "nearest",
    });
  }, 200);
};
/**
 * 回复的人
 * @param {Object} 回复的人数据
 */
const replyClk = (data) => {
  console.log("------回复的人", data);
};

/**
 * 图片查看器
 * @param {String} src 图片地址
 */
const imgShowClick = (src) => {
  imgShow.model = true;
  imgShow.src = src;
};

/**
 * 点赞评论按钮
 */
const upReply = debounce((data) => {
  const { isUp } = data;
  data.isUp = !isUp;
  // console.log(data);
}, 350);

const replyImgSize = computed(() => {
  let size = "150px";
  if (Screen.gt.sm) size = "200px";
  return size;
});
</script>
<style lang="sass" scoped>
@import url('../assets/styles/themes/commentMacDarkAndLight.sass')

.comment-child-avatar
  min-width: 32px

.comment-parent
  &::after
    position: absolute
    content: ''
    left: 34px
    top: 75px
    width: 1px
    height: calc( 100% - 135px )
    background: grey
    transform: scaleX(.5)
  &::before
    position: absolute
    content: ''
    background: grey
    width: 25px
    left: 34.5px
    height: 1px
    transform: scaleY(.5)
    bottom: 60px
    z-index: 1

.comment-child
  &::after
    position: absolute
    content: ''
    left: 35px
    top: 74.5px
    width: 25px
    height: 1px
    background: grey
    transform: scaleY(.5)

.open-comments
  &::after
    position: absolute
    right: 0
    top: 0
    content: ''
    height: 1px
    width: 25%
    transform: translate(-105px,24px) scaleY(.25)
    background: grey
</style>
 