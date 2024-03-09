import { defineStore } from 'pinia'

const navShowStore = defineStore('navShowStore', {
    state: () => ({
        /** 【revealOffset】
         * 隐藏导航栏的滚动距离
         * type:Number
         * default:200
         * 单位：px
         */
        revealOffset: 200,
        timer: null,
        navsConfig: {
            plates: {
                showNva: true,
                oldScrVal: 0,
            }
        },

    }),

    getters: {

    },

    actions: {
        onScroll(info) {
            clearTimeout(this.timer);

            const cha = info.verticalPosition - this.oldScrVal;

            if (cha > 0) {
                if (showNav.value === true) {
                    showNav.value = false;
                }
            } else {
                showNav.value = true;
            }

            this.timer = setTimeout(() => {
                this.oldScrVal = info.verticalPosition;
            }, 150);
        }
    }
})


export {
    navShowStore
}