import { defineStore } from 'pinia'
import { Dialog, Notify, Screen, debounce } from 'quasar'
import { anInit, getBatchs, killBatchs, createBatch, anRefresh, useIdfindBatchInfo } from "../utils/animate";
import { nextTick, ref } from 'vue';
import { newColsRule, userNameReplace } from '../utils/rules';
import noReArr from '../utils/noArr';

const diaLogEl = ref()
const giveGxianListEl = ref()

let anId = '';

const gloabStore = defineStore('gloabStore', {
    state: () => ({
        /**
         * !收藏
         */
        newColsMode: false,
        newColsName: '',
        showGiveGxianDialog: false,
        giveGxianModel: '1',
        gieGxColor: 'light-blue',//light-blue 普通用户颜色 | red 管理用户颜色
        editGxianCount: 0,//自定义赠送贡献值数量 
        diaLog: 0,//弹窗类型 0 赠送贡献值 | 1 收藏
        diaLogPos: 'standard',// standard | bottom
        diaLogClass: '',//'full-width' ''
        stars: [],
        selectStart: [],
        startData: [
            {
                title: '默认',
                id: '10'
            },
            {
                title: '电影',
                id: '0'
            },
            {
                title: '音乐',
                id: '1'
            },
            {
                title: '视频',
                id: '2'
            },
            {
                title: '戏剧',
                id: '3'
            },
            {
                title: 'asmr',
                id: '4'
            },
            {
                title: '好看的',
                id: '5'
            },
            {
                title: '好玩的',
                id: '6'
            },
            {
                title: '俩hi的',
                id: '7'
            },
            {
                title: '111',
                id: '8'
            },
        ],



        /**
         * !点赞
         */
        isUp: false,
    }),

    getters: {
        /**
         * !点赞
         */
        upIconOrColor() {
            if (this.isUp) return {
                icon: 'favorite',
                color: 'red'
            }


            return {
                icon: 'favorite_border',
                color: 'grey'
            }
        },



        /**
         * !收藏
         */
        // 收藏状态
        statIconAndColor() {
            const res = {
                color: 'grey',
                icon: 'star_outline'

            }
            if (this.selectStart.length) {
                res.icon = 'star'
                res.color = 'orange'
            }

            return res
        }
    },

    actions: {
        /**
         * !赠送贡献列表
         */
        giveGxianLishHideEv() {

        },

        async giveGxianLishShoeEv() {
            // await nextTick()
            // const batchArr = [];
            // giveGxianListEl.value.forEach(it => batchArr.push(it.$el))

            // anInit(batchArr,)
        },






        /**
         * !内容点赞
         */
        contentUpClick() {
            this.isUp = !this.isUp
        },





        /**
         * !收藏
         */
        /**
         * 新建收藏夹点击 
         */
        createCollection() {
            Dialog.create({
                title: "新建收藏夹",
                prompt: {
                    model: this.newColsName,
                    isValid: newColsRule, // << here is the magic
                    type: 'text', // optional
                    placeholder: '收藏夹名称'
                },

                ok: {
                    flat: false,
                    unelevated: true,
                    label: "新建",
                },
                cancel: true,
                transitionShow: "slide-up",
                transitionHide: "slide-up",
            }).onOk(async (data) => {
                data = userNameReplace(data)

                // 不可创建收藏夹名称一样
                const titleArr = []
                titleArr.push(data)
                this.startData.forEach(it => titleArr.push(it.title))
                const repArr = noReArr(titleArr),
                    repLen = repArr.length,
                    oldArrLen = this.startData.length;
                if (repLen <= oldArrLen) return Notify.create({
                    type: 'warning',
                    progress: true,
                    position: 'top',
                    message: '创建失败，文件夹名称重复',
                    icon: 'error_outline',
                })

                /**
                 * ! 创建收藏夹网络请求
                 */

                // const ram = Math.random() > .5
                const ram = true
                Notify.create({
                    // positive | warning
                    type: ram ? 'positive' : 'warning',
                    progress: true,
                    position: 'top',
                    message: ram ? '创建成功' : '创建失败，请重试！',
                    // check
                    icon: ram ? 'check' : 'error_outline',
                })

                if (!ram) return

                this.startData.splice(1, 0, { id: new Date().getTime().toString(), title: data })

                await nextTick()
                const el = diaLogEl.value[1].$el;
                createBatch(el, '.now-scroll .scroll', anId)
                anRefresh()
            })
            // t ? this.newColsMode = false : this.newColsMode = true
        },

        // 收藏夹完成按钮click事件
        startFinish() {
            this.toggleGiveGxianDialog()

            this.selectStart = this.stars

            if (this.selectStart.length) return Notify.create({
                progress: true,
                position: 'top',
                message: '收藏成功！',
            })

            Notify.create({
                progress: true,
                position: 'top',
                message: '取消收藏！',
            })
        },

        // 弹窗显示事件
        diaShowEv() {
            if (!this.diaLog) return

            // 创建列表动画
            const arr = []
            diaLogEl.value.forEach(el => arr.push(el.$el));
            anId = anInit(arr, '.now-scroll .scroll')
        },

        // 弹窗隐藏事件
        diaHideEv() {
            this.stars = this.selectStart
            if (!this.diaLog) return

            const batchs = getBatchs(anId)
            if (batchs && batchs.length) killBatchs(batchs)
            anId = ''
        },

        // 设置弹窗类型
        setDialog(t) {
            this.diaLog = t
            this.toggleGiveGxianDialog()

            // 大屏或赠送弹窗在中间
            if (Screen.gt.xs || !this.diaLog) {
                this.diaLogPos = 'standard'
                return this.diaLogClass = ''
            }

            this.diaLogPos = 'bottom'
            this.diaLogClass = 'full-width'
        },
        //  弹窗显示、隐藏切换
        toggleGiveGxianDialog() {
            this.showGiveGxianDialog = !this.showGiveGxianDialog
        },

        // 赠送贡献值按钮click事件
        startGivegXian() {
            console.log('赠送贡献值', this.giveGxianModel, this.editGxianCount);
            let count = this.giveGxianModel
            if (this.editGxianCount) count = this.editGxianCount
            Notify.create({
                progress: true,
                type: 'positive',
                html: true,
                position: 'top',
                message: '送出贡献值×' + count,
                icon: 'check'
            })
        }

    }
})


export default gloabStore

export {
    diaLogEl, giveGxianListEl
}