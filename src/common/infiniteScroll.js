/**
 * ? 无限滚动加载
 */
import { ref } from "vue";

import { scroll } from "quasar";
import axios from "axios";

const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll;


const load = (path) => {
    const disable = ref(true);//禁止刷新数据
    const data = ref(null);//数据
    const dataLoadFinish = ref(false); //滚动到最后 

    /**
     * 设置/获取滚动位置 
     * @returns {Function}
     */
    const scrollPos = () => {
        let scrollHeight = 0; //当前滚动高度

        /**
         * 设置/获取滚动位置 
         * @param {boolean} setHeight 默认值：false  |　true 设置滚动位置　| false 获取滚动位置
         */
        return (setHeight = false) => {
            const getScrollEl = document.querySelector('.scroll')//滚动元素

            if (setHeight) {
                setVerticalScrollPosition(getScrollEl, scrollHeight);
            } else {
                scrollHeight = getVerticalScrollPosition(getScrollEl);
            }
        }
    }

    /**
     * 滚动加载函数 
     */
    const infiniteLoad = async (index, done) => {
        const getData = await axios.get(path);
        // 数据滚动状态
        const stop = getData.data.finish;

        // 滚动加载结束
        if (stop) {
            dataLoadFinish.value = true;
            done(true);
            return;
        }

        // 继续滚动
        for (const listItem of getData.data.lists) {
            data.value.push(listItem);
        }

        done();
    };

    return {
        disable,
        data,
        dataLoadFinish,
        scrollPos,
        infiniteLoad
    }
}

export default load