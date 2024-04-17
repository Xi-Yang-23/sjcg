import Compressor from 'compressorjs';
import { ref } from 'vue';
import { format } from 'quasar'

const imgModel = ref(null), 
    imgComp = ref(null)


/**
 * 图片拾取更新事件
 * @param {File|Blob} imgData 拾取的图片数据
 */
// const imgUpEv = val => startYaSuo(val),
const imgUpEv = val => {
    const { size } = val
    let q = .6

    // 大于5m
    if (size > 5000000) {
        q = 0
    } else if (size > 1000000) {
        q = .3
    }
    const { result } = startYaSuo(val, q)
    console.log('压缩图', result);
},
    getImg = () => imgComp.value.pickFiles()



/**
 * 图片压缩
 * @param {File|Blob} imgData 拾取的图片数据
 * @param {Number} quality 压缩程度 0-1 ，如果没有，只要大于500kb的图片都会被压缩至500kb以内
 * @returns 返回压缩的图片数据
 */
const startYaSuo = (imgData, quality) => new Compressor(imgData, {
    quality,
    convertSize: 500000
})

export {
    imgModel,
    imgComp, 
    imgUpEv,
    getImg
}