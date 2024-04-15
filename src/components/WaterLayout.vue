<template>
  <div ref="waterLayoutBox" class="box">
    <slot></slot>
  </div>
</template>

<script setup>
import {
  computed,
  onUnmounted,
  onMounted,
  ref,
  onUpdated,
  watch,
  onActivated,
} from "vue";

onActivated(() => {
  waterLayouts();
});

/**
 * @cls {Number} 列数 默认【2】
 * @des {Boolean} 默认【false】 | 销毁瀑布流布局，若里面新增数据，将不会更新位置
 * @gap {Number} 间距 默认【5】，单位px
 * @w {Number,String} 宽度 默认【100%】
 * @an {String} 列数变化动画效果 默认【.5s ease】 ，例：【none】【.2s ease-in】【.2s ease-in-out】
 */
const props = defineProps({
  cls: {
    default: 2,
    type: Number,
  },

  des: {
    default: false,
    type: Boolean,
  },

  w: {
    default: "100%",
    type: String,
  },

  gap: {
    default: 5,
    type: Number,
  },

  an: {
    default: ".5s ease",
    type: String,
  },
});

const waterLayoutBox = ref(null);
let itElCounts = 0; //子元素个数

// 仅在可视区添加动画
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) =>
    entry.intersectionRatio > 0
      ? entry.target.classList.add("an")
      : entry.target.classList.remove("an")
  );
});

/**
 * 计算子属性
 * @returns {Object{cls,gap,itW}} cls列数 | gap间隔 | itW每列宽度 返回子属性
 */
const waterlayoutItInfo = computed(() => {
  let cls = props.cls; //列数
  let gap = props.gap; //间距

  if ((typeof cls === "number" && cls < 2) || typeof cls !== "number") {
    cls = 2;
  }

  // 间距 ，最低为0，默认5
  if ((typeof gap === "number" && gap < -1) || typeof gap !== "number") {
    gap = 5;
  }
  return {
    itW: `calc(100% / ${cls} - ${gap * (cls - 1)}px / ${cls})`,
    cls,
    gap,
  };
});

/**
 * 瀑布流布局
 * @param UpData {Boolean} 数据是否更新
 */
let waterLayouts = (UpData = 0) => {
  let cls = waterlayoutItInfo.value.cls; //列数
  let gap = waterlayoutItInfo.value.gap; //间距

  const itYPos = [], //每列距离顶部位置（单维数组）
    itXPos = []; //每列距离左边位置（单维数组）

  const w = waterLayoutBox.value.clientWidth;
  const itW = (w - (cls - 1) * gap) / cls; //每列宽度

  for (let i = 0; i < cls; i++) {
    itYPos.push(0);

    i === 0 ? itXPos.push(0) : itXPos.push(i * itW + gap * i);
  }

  const elsArr = waterLayoutBox.value.children;

  // 遍历子元素
  for (let i = 0; i < elsArr.length; i++) {
    if (waterLayoutBox.value.children.length > itElCounts && UpData) {
      itElCounts++;
    }

    const it = elsArr[i];

    // 给出现视口区域的元素添加动画效果
    if (props.an !== "none") io.observe(it);

    // 元素位置与下标
    const itPos = {
      x: 0, //距离左边位置
      y: 0, //距离顶部位置
      I: 0, //当前元素下标
    };

    if (i < cls) {
      const colI = i % cls; // 第n列

      itPos.x = itXPos[colI] + "px";
      itPos.y = 0;
      itPos.I = colI;
    } else {
      const colsMin = Math.min(...itYPos), //高度最小的列
        minColsIndex = itYPos.findIndex((it) => it === colsMin); //最小列的下标

      itPos.x = itXPos[minColsIndex] + "px";
      itPos.y = colsMin + "px";
      itPos.I = minColsIndex;
    }

    it.style.transform = `translate(${itPos.x},${itPos.y})`; // 设置元素x,y位置

    const colsItTopVal = it.offsetHeight + gap; // 第n列距离顶部位置
    itYPos[itPos.I] += colsItTopVal;

    if (i === elsArr.length - 1) {
      waterLayoutBox.value.style.height = Math.max(...itYPos) + "px";
    }
  }
};

/**
 * 防抖函数 》 dbc
 * @param fun {function} 处理函数
 * @param dt {Number} 防抖时间间隔 默认520ms
 */
const dbc = (f, dt = 520) => {
  let timer = null;

  return (ud) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      f(ud);
      timer = null;
    }, dt);
  };
};

let wlyFun = dbc(waterLayouts);
onMounted(() => {
  waterLayouts(1);
  window.addEventListener("resize", dbc(waterLayouts));
});

let firstRender = true;
onUpdated(() => {
  const itsLen = waterLayoutBox.value.children.length;
  if (firstRender) {
    firstRender = false;
  } else if (itsLen > itElCounts) {
    // 列数，间隔发生改变
    waterLayouts(1);
  }
});

// props发生改变
watch(props, () => {
  wlyFun();

  if (props.des) {
    // 清除定时器
    window.removeEventListener("resize", wlyFun);
    // 销毁瀑布流布局
    waterLayouts = wlyFun = null;
  }
});

onUnmounted(() => window.removeEventListener("resize", wlyFun));
</script>

<style scoped lang="sass" >
.box
  width: v-bind('props.w')
  position: relative

.box
  :deep(>*)
    width: v-bind('waterlayoutItInfo.itW')
    position: absolute
  :deep(.an)
    transition: v-bind('props.an')
</style>
 