<!-- 评论组件 -->
<template>
  <!-- 虚拟评论框 -->
  <q-footer
    v-if="Screen.lt.md"
    reveal
    :class="themeStore.toolBarColor"
    :height-hint="10"
  >
    <q-item>
      <q-item-section>
        <!-- 回复的人 -->
        <transition leave-active-class="animated zoomOutLeft slow">
          <div v-if="bigReplyCfg.showReply" class="flex items-center">
            <q-item-label :lines="1" caption>
              {{ replyInfo.placehodel }}
            </q-item-label>
            <q-btn
              dense
              size="sm"
              padding="xs md"
              color="red"
              flat
              icon="close"
              @click="closeReplyComment"
            />
          </div>
        </transition>
        <!-- 评论输入框   -->
        <div
          :placeholder="replyInfo.placehodel"
          class="textarea xv-ni full-width rounded-borders q-px-sm cursor-pointer ellipsis overflow-hidden"
          @click="xuNiReplyClk"
          ref="xuNiTextareaEl"
          v-html="replyInfo.xuNiTeatareaTxt"
        ></div>
      </q-item-section>

      <q-item-section side class="start-reply">
        <q-btn
          color="primary"
          icon="send"
          unelevated
          v-ripple="{ color: 'primary' }"
          :disabled="inputIsDisabled"
          @click="sendMsg"
          :loading="replyInfo.subCommentLoading"
        />
      </q-item-section>
    </q-item>
  </q-footer>

  <!-- 大屏输入框 -->
  <q-card
    v-else
    class="fixed-bottom-right mini-heriz no-padding"
    flat
    :style="{ width: props.bigScreen }"
  >
    <!-- 艾特选择 -->
    <!-- 艾特用户列表  -->
    <transition
      appear
      enter-active-class="animated bounceInLeft slow"
      leave-active-class="animated backOutRight slow"
    >
      <q-card
        class="overflow-hidden"
        square
        v-show="replyInfo.showAt"
        style="max-width: 400px"
      >
        <q-list padding separator class="reply-at">
          <transition-group
            appear
            enter-active-class="animated bounceInLeft slow"
            leave-active-class="animated zoomOutLeft slow"
          >
            <q-item
              v-for="(it, ati) in renderAtList"
              tag="label"
              v-ripple
              :key="'checkAtArr' + ati"
            >
              <!-- 多选框 -->
              <q-item-section side>
                <q-checkbox
                  checked-icon="task_alt"
                  unchecked-icon="radio_button_unchecked"
                  v-model="replyInfo.checkAtArr"
                  :val="it.id"
                  :disable="it.disabled"
                />
              </q-item-section>

              <!-- 艾特头像 -->
              <q-item-section avatar>
                <q-avatar>
                  <q-img src="/avatar.jpeg">
                    <template v-slot:loading>
                      <q-spinner-infinity color="primary" size="sm" />
                    </template>
                  </q-img>

                  <!-- 用户认证 -->
                  <q-icon size="xs" class="absolute-bottom-right ren-zheng">
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
                </q-avatar>
              </q-item-section>

              <!-- 昵称 -->
              <q-item-section>
                <q-item-label :lines="1">
                  {{ it.uName }}
                </q-item-label>

                <!-- @的用户信息 -->
                <div class="flex q-gutter-x-sm items-center q-pt-xs">
                  <q-badge color="green" text-color="white" label="审核员" />

                  <!-- ip -->
                  <div class="text-caption flex items-center">
                    <q-icon name="place" />贵州
                  </div>

                  <div class="text-caption flex items-center">
                    <!-- female男 女male -->
                    <q-icon name="male" color="pink" />
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>

        <!-- 显示艾特数量 -->
        <q-card-section
          class="text-h6 q-py-none"
          :class="replyAn.tipShowOrHide"
        >
          <span>{{ replyAn.atLen }}</span
          >&nbsp;/&nbsp;{{ replyInfo.atMaxLen }}
        </q-card-section>
      </q-card>
    </transition>

    <!-- 选择、插入的图片 -->
    <transition
      appear
      enter-active-class="animated zoomInDown slow"
      leave-active-class="animated zoomOutLeft slow"
    >
      <q-card
        flat
        class="relative-position inline-block"
        v-if="replyInfo.fileImg !== '' && replyInfo.fileImg.length"
      >
        <q-card-section class="q-pb-xs">
          <q-img
            class="rounded-borders cursor-pointer"
            height="60px"
            width="60px"
            :ratio="1"
            :src="replyInfo.fileImg"
          />
          <q-btn
            icon="cancel"
            class="absolute-top-right"
            size="sm"
            padding="xs"
            color="red"
            flat
            @click="clearImg"
          />
        </q-card-section>
      </q-card>
    </transition>

    <!-- 输入框  :style="{ width: `calc(${videoInfoHeight.w} - 248px)` }"-->
    <q-item class="q-px-sm">
      <q-item-section class="overflow-hidden full-wdith">
        <!-- 回复的人 -->
        <transition
          appear
          enter-active-class="animated zoomInDown slow"
          leave-active-class="animated zoomOutLeft slow"
        >
          <div v-if="bigReplyCfg.showReply" class="flex items-center">
            <q-item-label :lines="1" caption>
              {{ replyInfo.placehodel }}
            </q-item-label>
            <q-btn
              dense
              size="sm"
              padding="xs md"
              color="red"
              flat
              icon="close"
              @click="closeReplyComment"
            />
          </div>
        </transition>

        <!-- 评论输入框 -->
        <div
          ref="textAreaEl"
          contenteditable="true"
          :placeholder="replyInfo.placehodel"
          class="textarea q-pa-sm text-body2 rounded-borders full-wdith"
          @input="replyInput"
          @click="replyClick($event)"
          @paste="pasteEv($event)"
          @copy="copy($event)"
          @focus="bigInputFocusAndBlur($event)"
          @blur="bigInputFocusAndBlur($event)"
        ></div>
      </q-item-section>

      <!-- 发送按钮  -->
      <q-item-section side style="padding-left: 8px" class="start-reply">
        <q-btn
          color="primary"
          icon="send"
          unelevated
          v-ripple="{ color: 'primary' }"
          :disabled="inputIsDisabled"
          @click="sendMsg"
          :loading="replyInfo.subCommentLoading"
        />
      </q-item-section>
    </q-item>

    <!-- 大屏输入框操作栏 -->
    <transition
      appear
      enter-active-class="animated zoomInDown slow"
      leave-active-class="animated zoomOutLeft slow"
    >
      <q-card-actions align="left" v-show="bigReplyCfg.showTabs">
        <!-- 输入框主题  @click="replyThemeClk"-->
        <q-btn icon="style" unelevated flat>
          <q-menu
            :offset="[0, 70]"
            transition-show="slide-up"
            transition-hide="slide-down"
          >
            <!-- 评论主题选择 -->
            <q-card-section class="reply-bar-hei">
              <q-btn
                color="blue-8"
                dense
                flat
                padding="none"
                label="兑换主题"
              />

              <q-option-group
                v-model="replyThemeSelect"
                type="radio"
                class="q-gutter-lg"
                :options="replyThemeList"
              >
                <template v-slot:label="opt">
                  <div :class="opt.class" class="reply-width">
                    <div class="q-pt-sm">{{ opt.label }}</div>
                  </div>
                </template>
              </q-option-group>
            </q-card-section>
          </q-menu>
        </q-btn>

        <!-- 艾特按钮  @click="atClk"  -->
        <q-btn icon="alternate_email" unelevated flat />

        <!-- 打开系统文件夹按钮 -->
        <q-btn icon="folder_open" unelevated @click="fileImg(file)">
          <q-file
            hide-hint
            @update:model-value="fileImgUpdata"
            ref="file"
            v-show="false"
            accept="image/*"
          />
        </q-btn>

        <!-- 选择收藏的图片按钮 -->
        <q-btn icon="favorite_border" unelevated>
          <q-menu
            transition-show="slide-up"
            transition-hide="slide-down"
            :offset="[0, 70]"
          >
            <!-- 删除、添加图片     -->
            <div class="flex no-wrap relative-position mini-heriz-bottom">
              <q-btn icon="add" flat @click="likeImgClk(0)" />
              <q-btn
                :icon="
                  replyInfo.showDelLikeImgBtn ? 'delete_forever' : 'o_delete'
                "
                flat
                @click="likeImgClk(1)"
                :color="replyInfo.showDelLikeImgBtn ? 'red' : ''"
              />
            </div>

            <!-- 收藏的图片 -->
            <q-card-section
              class="row overflow-auto"
              style="max-width: 400px; height: 200px"
            >
              <div v-for="(it, id) in emjioList" class="col-3">
                <!-- 添加收藏的表情 -->
                <q-item
                  clickable
                  v-ripple
                  class="q-pa-sm rounded-borders justify-center items-center"
                  @click="likeImgClk($event, it.src, id)"
                >
                  <q-img :src="it.src">
                    <template v-slot:loading>
                      <q-spinner-hearts color="primary" size="md" />
                    </template>
                  </q-img>
                </q-item>

                <!-- 删除收藏的表情的按钮 -->
                <q-btn
                  icon="remove_circle"
                  color="red"
                  flat
                  unelevated
                  size="xs"
                  class="full-width"
                  @click="likeImgClk(3)"
                  v-show="replyInfo.showDelLikeImgBtn"
                />
              </div>
            </q-card-section>
          </q-menu>
        </q-btn>

        <!-- emjio表情选择按钮 -->
        <q-btn icon="sentiment_satisfied_alt" unelevated>
          <q-menu
            transition-show="slide-up"
            transition-hide="slide-down"
            :offset="[0, 70]"
          >
            <!-- emjio表情 -->
            <q-card-section class="reply-bar-hei row" style="max-width: 300px">
              <!-- emjio列表 -->
              <q-item
                clickable
                v-ripple
                class="no-padding col-2 rounded-borders justify-center items-center"
                v-for="(it, i) in emjioList"
                :key="'emjio' + i"
                @click="emjioListClk(it.src, it.name)"
              >
                <q-avatar size="md">
                  <q-img :src="it.src">
                    <template v-slot:loading>
                      <q-spinner-ios color="primary" size="xs" />
                    </template>
                  </q-img>
                </q-avatar>
              </q-item>
            </q-card-section>
          </q-menu>
        </q-btn>

        <q-space />
        <!-- 关闭操作栏 -->
        <q-btn
          icon="close"
          color="grey"
          @click="bigReplyCfg.showTabs = false"
          flat
        />
      </q-card-actions>
    </transition>
  </q-card>

  <!-- 小屏真实输入框弹窗 -->
  <q-dialog
    v-model="replyInfo.showReplyInput"
    position="bottom"
    v-if="Screen.lt.md"
    class="full-width"
    transition-hide="slide-down"
    transition-show="slide-up"
    full-width
  >
    <!-- 艾特选择 -->
    <transition
      appear
      enter-active-class="animated zoomInDown slow"
      leave-active-class="animated zoomOutLeft slow"
    >
      <q-card v-show="replyInfo.showAt" class="overflow-hidden" square>
        <!-- 艾特用户列表      v-for="(it, ati) in replyInfo.atUserLists" -->
        <q-list padding separator class="reply-at">
          <transition-group
            appear
            enter-active-class="animated bounceInLeft slow"
            leave-active-class="animated zoomOutLeft slow"
          >
            <q-item
              v-for="(it, ati) in renderAtList"
              tag="label"
              v-ripple
              :key="'checkAtArr' + ati"
            >
              <!-- 多选框 -->
              <q-item-section side>
                <q-checkbox
                  checked-icon="task_alt"
                  unchecked-icon="radio_button_unchecked"
                  v-model="replyInfo.checkAtArr"
                  :val="it.id"
                  :disable="it.disabled"
                />
              </q-item-section>

              <!-- 艾特头像 -->
              <q-item-section avatar>
                <q-avatar>
                  <q-img src="/avatar.jpeg">
                    <template v-slot:loading>
                      <q-spinner-infinity color="primary" size="sm" />
                    </template>
                  </q-img>

                  <!-- 用户认证 -->
                  <q-icon size="xs" class="absolute-bottom-right ren-zheng">
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
                </q-avatar>
              </q-item-section>

              <!-- 昵称 -->
              <q-item-section>
                <q-item-label :lines="1">
                  {{ it.uName }}
                </q-item-label>

                <!-- @的用户信息 -->
                <div class="flex q-gutter-x-sm items-center q-pt-xs">
                  <q-badge color="green" text-color="white" label="审核员" />

                  <!-- ip -->
                  <div class="text-caption flex items-center">
                    <q-icon name="place" />贵州
                  </div>

                  <div class="text-caption flex items-center">
                    <!-- female男 女male -->
                    <q-icon name="male" color="pink" />
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
        <!-- 显示艾特数量 -->
        <q-card-section
          class="text-h6 q-py-none"
          :class="replyAn.tipShowOrHide"
        >
          <span>{{ replyAn.atLen }}</span
          >&nbsp;/&nbsp;{{ replyInfo.atMaxLen }}
        </q-card-section>
      </q-card>
    </transition>

    <!-- 主体输入框 -->
    <q-card flat>
      <!-- 选择、插入的图片 -->
      <transition
        appear
        enter-active-class="animated zoomInDown slow"
        leave-active-class="animated zoomOutLeft slow"
      >
        <q-card
          flat
          class="relative-position inline-block"
          v-if="replyInfo.fileImg !== '' && replyInfo.fileImg.length"
        >
          <q-card-section class="q-pb-xs">
            <q-img
              class="rounded-borders cursor-pointer"
              height="60px"
              width="60px"
              :ratio="1"
              :src="replyInfo.fileImg"
            />
            <q-btn
              icon="cancel"
              class="absolute-top-right"
              size="sm"
              padding="xs"
              color="red"
              flat
              @click="clearImg"
            />
          </q-card-section>
        </q-card>
      </transition>

      <!-- 输入框 -->
      <q-item>
        <q-item-section class="overflow-hidden">
          <transition
            appear
            enter-active-class="animated zoomInDown slow"
            leave-active-class="animated zoomOutLeft slow"
          >
            <div v-if="bigReplyCfg.showReply" class="flex items-center">
              <q-item-label :lines="1" caption>
                {{ replyInfo.placehodel }}
              </q-item-label>
              <q-btn
                dense
                size="sm"
                padding="xs md"
                color="red"
                flat
                icon="close"
                @click="closeReplyComment"
              />
            </div>
          </transition>

          <!-- 评论输入框 -->
          <div
            ref="textAreaEl"
            contenteditable="true"
            :placeholder="replyInfo.placehodel"
            class="textarea q-pa-sm text-body2 rounded-borders"
            @input="replyInput"
            @click="replyClick($event)"
            @paste="pasteEv($event)"
            @copy="copy($event)"
          ></div>
        </q-item-section>

        <!-- 发送按钮 -->
        <q-item-section side class="start-reply">
          <q-btn
            color="primary"
            icon="send"
            unelevated
            v-ripple="{ color: 'primary' }"
            :disabled="inputIsDisabled"
            @click="sendMsg"
            :loading="replyInfo.subCommentLoading"
          />
        </q-item-section>
      </q-item>

      <!-- bars输入框操作栏  v-show="replyInfo.showBars"-->
      <q-item class="q-py-none row justify-end">
        <!-- 删除、添加图片     -->
        <transition
          appear
          enter-active-class="animated zoomInDown slow"
          leave-active-class="animated zoomOutUp slow"
        >
          <div class="flex no-wrap" v-show="replyInfo.diaLogType === 3">
            <q-btn icon="add" flat @click="likeImgClk(0)" />
            <q-btn
              :icon="
                replyInfo.showDelLikeImgBtn ? 'delete_forever' : 'o_delete'
              "
              flat
              @click="likeImgClk(1)"
              :color="replyInfo.showDelLikeImgBtn ? 'red' : ''"
            />
            <q-separator vertical inset />
          </div>
        </transition>

        <!-- 输入框主题 -->
        <q-space />
        <!-- 评论主题按钮  -->
        <q-btn
          v-show="replyInfo.diaLogType !== 3"
          :class="{
            'reply-bar-select':
              replyInfo.showReplyInput === true && replyInfo.diaLogType === 4,
          }"
          icon="style"
          unelevated
          flat
          @click="replyThemeClk"
        />

        <!-- 艾特按钮 -->
        <q-btn icon="alternate_email" unelevated flat @click="atClk" />

        <!-- 打开系统文件夹按钮 -->
        <q-btn icon="folder_open" unelevated @click="fileImg(file)">
          <q-file
            hide-hint
            @update:model-value="fileImgUpdata"
            ref="file"
            v-show="false"
            accept="image/*"
          />
        </q-btn>

        <!-- 选择收藏的图片按钮 -->
        <q-btn
          icon="favorite_border"
          unelevated
          flat
          @click="replyBarClk(3)"
          :class="{
            'reply-bar-select':
              replyInfo.showReplyInput === true && replyInfo.diaLogType === 3,
          }"
        />

        <!-- emjio表情选择按钮 -->
        <q-btn
          icon="sentiment_satisfied_alt"
          unelevated
          @click="replyBarClk(1)"
          :class="{
            'reply-bar-select':
              replyInfo.showReplyInput === true && replyInfo.diaLogType === 1,
          }"
        />
      </q-item>

      <!-- 操作栏-->
      <q-card flat>
        <!-- 评论主题选择 -->
        <q-card-section
          class="reply-bar-hei"
          v-show="replyInfo.diaLogType === 4"
        >
          <q-btn color="blue-8" dense flat padding="none" label="兑换主题" />

          <q-option-group
            v-model="replyThemeSelect"
            type="radio"
            class="q-gutter-lg"
            keep-color
            :options="replyThemeList"
          >
            <template v-slot:label="opt">
              <div :class="opt.class" class="reply-width relative-position">
                <div class="q-pt-sm">{{ opt.label }}</div>
              </div>
            </template>
          </q-option-group>
        </q-card-section>

        <!-- emjio表情 -->
        <q-card-section
          class="reply-bar-hei row"
          v-show="replyInfo.diaLogType === 1"
        >
          <!-- emjio列表 -->
          <q-item
            clickable
            v-ripple
            class="no-padding col-2 rounded-borders justify-center items-center"
            v-for="(it, i) in emjioList"
            :key="'emjio' + i"
            @click="emjioListClk(it.src, it.name)"
          >
            <q-avatar size="md">
              <q-img :src="it.src">
                <template v-slot:loading>
                  <q-spinner-ios color="primary" size="xs" />
                </template>
              </q-img>
            </q-avatar>
          </q-item>
        </q-card-section>

        <!-- 收藏的图片 -->
        <q-card-section
          class="reply-bar-hei row"
          v-show="replyInfo.diaLogType === 3"
        >
          <div v-for="(it, id) in emjioList" class="col-3">
            <!-- 添加收藏的表情 -->
            <q-item
              clickable
              v-ripple
              class="q-pa-sm rounded-borders justify-center items-center"
              @click="likeImgClk($event, it.src, id)"
            >
              <q-img :src="it.src">
                <template v-slot:loading>
                  <q-spinner-hearts color="primary" size="md" />
                </template>
              </q-img>
            </q-item>

            <!-- 删除收藏的表情的按钮 -->
            <q-btn
              icon="remove_circle"
              color="red"
              flat
              unelevated
              size="xs"
              class="full-width"
              @click="likeImgClk(3)"
              v-show="replyInfo.showDelLikeImgBtn"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { theme } from "../stores/themeStore";
const themeStore = theme();
import {
  bigInputFocusAndBlur,
  bigReplyCfg,
  sendMsg,
  renderAtList,
  replyClick,
  likeImgClk,
  textAreaEl,
  clearImg,
  replyInfo,
  pasteEv,
  fileImg,
  fileImgUpdata,
  replyInput,
  replyBarClk,
  emjioList,
  emjioListClk,
  replyAn,
  xuNiReplyClk,
  xuNiTextareaEl,
  atClk,
  copy,
  replyThemeClk,
  closeReplyComment,
} from "../common/reply";
import { computed, nextTick, ref, watch } from "vue";
import { Screen } from "quasar";

// 屏幕变化情况输入框
watch(
  () => Screen.name,
  (n) => (replyInfo.comments = replyInfo.xuNiTeatareaTxt = "")
);

const props = defineProps(["bigScreen"]);

/**
 * 检测是否可发送评论
 */
const inputIsDisabled = computed(() => {
  // 评论的字符长度
  const txt = replyInfo.xuNiTeatareaTxt;
  const repSpace = txt
      .replace(/(<\/?div>)/gi, "")
      .replaceAll("<br>", "")
      .replaceAll(/[&nbsp;\s]/gi, ""),
    commentLen = repSpace.length;
  if (commentLen) return false;

  return true;
});

const file = ref();

// 所有主题

const replyThemeSelect = ref("none");
const replyThemeList = ref([
  {
    label: "无主题",
    value: "none",
    disable: false,
    class: "",
    description: "没有任何主题",
    checkedIcon: "done_outline",
    uncheckedIcon: "minimize",
  },

  {
    label: "mac Light",
    value: "macLight",
    disable: true,
    description: "mac亮色主题",
    class: "mac-light no",
    checkedIcon: "done_outline",
    uncheckedIcon: "minimize",
  },
  {
    label: "mac Dark",
    value: "macDark",
    disable: true,
    description: "mac暗色主题",
    class: "mac-dark",
    checkedIcon: "done_outline",
    uncheckedIcon: "minimize",
  },
]);

const replyThemeInit = () => {
  const { replyTheme } = themeStore;
  if (!replyTheme || !replyTheme.length) return;

  replyTheme.forEach((it) => {
    const findTheme = replyThemeList.value.find(
      (it2) => it2.value === it.value
    );

    if (!findTheme) return;

    findTheme.disable = false;
    if (findTheme.selcet) replyThemeSelect.value = findTheme.value;
  });
};

replyThemeInit();
</script>

<style lang="sass" scoped>
@import url('../assets/styles/themes/commentMacDarkAndLight.sass')

.reply-width
  width: 200px

.no
  opacity: .7
</style>