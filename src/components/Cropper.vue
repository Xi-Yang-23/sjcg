<template>
  <div>
    <img ref="image" class="fit img" :src="props.url" />
  </div>
</template>

<script setup>
// 引入cropperjs库与相关css
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { watch, onMounted, ref } from "vue";
import { debounce } from "quasar";

// 传来的图片地址
const props = defineProps({
    url: "",
    // 比例
    aspectRatio: {
      default: 1 / 1,
    },
  }),
  image = ref(null), //img元素
  emit = defineEmits(["clip-img"]);

// 监听props
watch(props, (val) => {
  // 设置cropper
  cropper.setAspectRatio(val.aspectRatio);
  cropper.replace(val.url);
});

/**
 * 获取裁剪的base64图片发给父级
 * @param {canvas} cvs canvas数据
 */
const clipImgEmitBase64Img = (cvs) => {
  // 将canvas转为图片数据 → 参数1:图片格式[image/webp, image/jpeg, image/png] | 参数2：图片裁剪后的清晰度，相当于压缩图片 0 - 1(只对jpeg与webp有效)
  const base64 = cvs.toDataURL("image/webp", 0.75);

  // 裁剪后发送数据给父级
  emit("clip-img", base64);
};

let cropper = null;
onMounted(() => {
  cropper = new Cropper(image.value, {
    aspectRatio: props.aspectRatio, //裁剪比例 → 例：[1 / 1, 19 / 9 ,...........]
    viewMode: 1, //裁剪模式 [0,1,2,3]
    dragMode: "move",
    // 重点：加载完成将第一次裁剪的图片数据发给父级
    ready() {
      clipImgEmitBase64Img(this.cropper.getCroppedCanvas());
    },
    // 鼠标、手指移开触发
    cropend() {
      clipImgEmitBase64Img(this.cropper.getCroppedCanvas());
    },

    // 缩放触发，这里最好用防抖函数，不然缩放非常卡，影响用户体验，加入我已有防抖，例子如下
    zoom: debounce(function () {
      clipImgEmitBase64Img(this.cropper.getCroppedCanvas());
    }, 500),
  });
});
</script>

<style scoped>
.img {
  object-fit: contain;
  max-width: 100%;
}
</style>
