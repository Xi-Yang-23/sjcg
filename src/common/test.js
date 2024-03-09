import { ref } from "vue";

const 闭包函数 = () => {
    const 帅哥 = ref(false)
    const 美女 = ref(null)
    const 其它 = ref([])
    return {
        帅哥,
        美女,
        其它,
    }
}

export default 闭包函数