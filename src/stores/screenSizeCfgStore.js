import { defineStore } from 'pinia'
import { Screen } from "quasar";

const screenSizeCfgStore = defineStore('screenSizeCfgStore', {
    state: () => ({
        /**
              * 称号用户
              */
        isAdminTitle: Math.random() > .5 ? false : true
    }),

    getters: {
        /**
        * !卡片的字体大小
        */
        contentFontSize() {
            return Screen.lt.sm ? 'text-body1' : 'text-h6'
        },

        contentPad() {
            return Screen.gt.xs ? '' : 'no-padding'
        },

        cardImgSize() {
            const nm = Screen.name
            let res = ''
            switch (nm) {
                case "xs":
                    res = {
                        w: '130px',
                        h: '96.8px',
                    }
                    break;

                case "sm":
                    res = {
                        w: '140px',
                        h: '106px',
                    }
                    break;

                default:
                    res = {
                        w: '160px',
                        h: '120px',
                    }
                    break;
            }
            return res

        },

        cardAxctionPad() {
            const nm = Screen.name
            let size = ''
            switch (nm) {
                case "xs":
                    size = 'q-py-none'
                    break;

                case "sm":
                    size = 'q-pb-sm q-pb-xs'
                    break;

                default:
                    size = 'q-pb-sm q-pt-xs'
                    break;
            }
            return size

        },

        /**
         * 用户界面
         */
        user() {
            let contentGap = '',
                bgPaddinfLeft = '',
                showBtHeize = 'mini-heriz-bottom relative-position',
                tabAlign = 'justify',
                tabInline = false;


            if (Screen.gt.sm) {
                contentGap = 'q-col-gutter-md'
                showBtHeize = ''
                tabAlign = 'left'
                tabInline = true
            }

            if (Screen.gt.xs) {
                bgPaddinfLeft = '200px'
            }

            return {
                contentGap,
                bgPaddinfLeft,
                showBtHeize,
                tabAlign,
                tabInline
            }
        }

    }
})


export default screenSizeCfgStore