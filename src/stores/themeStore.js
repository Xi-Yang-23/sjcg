import { defineStore } from 'pinia'
import {
    setCssVar,
    Dark,
    useQuasar
} from 'quasar'

const theme = defineStore('theme', {
    state: () => ({
        primaryColor: null,//主色
        dark: false,// 暗黑主题   
        //评论框主题 | 已拥有的主题
        replyTheme: [
            {
                value: 'macDark',
                class: 'mac-dark',
                selcet: false,//是否启用主题
            }
        ],
    }),
    // persist: {
    //     // 数据恢复后
    //     afterRestore: (ctx) => {
    //         if (ctx.store.primaryColor) setCssVar('primary', ctx.store.primaryColor)
    //         if (ctx.store.dark !== null) Dark.set(ctx.store.dark)
    //     },
    // },
    persist: {
        paths: ['primaryColor', 'replyTheme', 'dark'],
        // 数据恢复后
        afterRestore: (ctx) => {
            if (ctx.store.primaryColor) setCssVar('primary', ctx.store.primaryColor)
            if (ctx.store.dark !== null) Dark.set(ctx.store.dark)
        },
    },

    getters: {
        // 导航栏色
        toolBarColor(state) {
            return state.dark === true ? "bg-dark" : "bg-white text-black"
        },

        // 滚动条
        scrollBarStyle(state) {
            const scrSizeGtXs = useQuasar().screen.gt.xs,
                width = scrSizeGtXs ? '6px' : '3px'
            return {
                thumbStyle: {
                    // right: '1px',
                    // borderRadius: 'none',
                    // backgroundColor: state.primaryColor,
                    width,
                    // opacity: 0.75
                },

                barStyle: {
                    // right: '0',
                    // borderRadius: '10px',
                    // backgroundColor: state.primaryColor,
                    width,
                    // opacity: 0.2
                }
            }
        }

    },

    actions: {
        // 设置主色
        setPrimaryColor(currColor) {
            this.primaryColor = currColor
            setCssVar('primary', currColor)
        },

        // 设置暗黑主题
        setDark() {
            Dark.toggle()
            this.dark = Dark.isActive
        },
    }
})


export {
    theme
}