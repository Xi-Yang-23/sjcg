<template>
  <q-page padding>
    <q-item v-for="(it, i) in showOrHideTextStatu">
      <q-item-section>
        <q-item-label
          caption
          :lines="it.lines"
          ref="essOutEl"
          class="text-body1"
        >
          <span v-if="i === 0"> 文本文本文本文本文本文本文本文 </span>
          <span v-else>
            文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本
          </span>
        </q-item-label>
      </q-item-section>
      <q-item-section side class="no-padding self-end">
        <q-checkbox
          v-if="!it.dis"
          v-model="it.show"
          dense
          size="sm"
          color="blue-grey"
          checked-icon="arrow_drop_up"
          unchecked-icon="arrow_drop_down"
          @update:model-value="textOverOpenClick(it)"
        />
      </q-item-section>
    </q-item>
    <!--  animated bounceInLeft slow -->
    <!-- srcElement.offsetParent.offsetParent -->
    <q-infinite-scroll @load="onLoad" :offset="250" class="cont">
      <q-item v-for="i in arr" :key="i" class="box op-0">
        <q-item-section top avatar>
          <q-avatar color="primary" text-color="white" icon="bluetooth" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ i }}Single line item</q-item-label>
          <q-item-label caption lines="2">Secondary line text.</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label caption>5 min ago</q-item-label>
          <q-icon name="star" color="yellow" />
        </q-item-section>
      </q-item>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>
  
<script setup>
import { gsap } from "gsap";
import { random } from "gsap/gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { nextTick, onMounted, ref } from "vue";
import { anInit, createBatch } from "../utils/animate";
import { textOverInit, textOverOpenClick } from "../utils/textOver";

/**
 * @lines String|number default:1 动态改变的数值，例如： 1 2 3.... 。none 没有限制
 * @show boolean default:fasle 显示、隐藏展开按钮。 true 显示 | false 隐藏
 * @once boolean defalut:false  true:只触发一次 false:触发多次
 * @val String|number defalut:1 当前显示的行数
 * @dis false boolean defalut:false 销毁展开按钮
 */
const essOutEl = ref();
const showOrHideTextStatu = ref([
  {
    lines: 1,
    val: 1,
    show: false,
    once: false,
    isOver: false,
    dis: false,
  },
  {
    lines: 2,
    show: false,
    val: 2,
    dis: false,
    once: true,
    isOver: false,
  },
  {
    lines: 3,
    show: false,
    once: false,
    isOver: false,
    val: 3,
    dis: false,
  },
]);

gsap.registerPlugin(TextPlugin);

const a = ref(0);
const arr = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const onLoad = (i, t) => {
  const dataLen = arr.value.length;
  setTimeout(async () => {
    arr.value.splice(arr.value.length, 0, ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // arr.value.unshift(...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    t();

    await nextTick();
    const getChildEl = document.querySelectorAll(
      `.box:nth-child(n+${dataLen + 1})`
    );

    createBatch(getChildEl);
    ScrollTrigger.refresh();
  }, 1000);
};
onMounted(() => {
  anInit(".box");
  console.log(essOutEl.value);
  textOverInit(essOutEl.value, showOrHideTextStatu.value, 0);
});
</script>

<style lang="sass">
</style>