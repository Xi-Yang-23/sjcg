import { defineStore } from 'pinia'
import { Dialog, Loading, Notify, QSpinnerOrbit, Screen } from 'quasar'
import { anInit, getBatchs, killBatchs, createBatch, anRefresh, showBatch } from "../utils/animate";
import { nextTick, ref } from 'vue';
import { giveGxinRule, newColsRule, userNameReplace } from '../utils/rules';
import useUserInfoStore from './userInfo';


const diaLogEl = ref()
const giveGxianListEl = ref()

let anId = '';

const gloabStore = defineStore('gloabStore', {
    state: () => ({
        /**
         * !收藏
         */
        /**
         * 新建的收藏夹名称
         */
        createStarName: '',
        /**
         * # 编辑收藏夹
         */
        editStarInfo: false,
        /**
         * # 编辑的收藏夹信息
         */
        editStarObj: { img: '', title: '', id: '' },



        isGuanli: true,//是否为管理员 
        giveGxType: 0,//赠送贡献类型 0 default：0 | 普通成员 | 1 管理
        toggleInputTypeBtnTxt: '自定义',


        /**
         * 赠送贡献弹窗
         */
        showGiveGxianDialog: false,
        giveGxianModel: '',
        giveGxBtnLoad: false,
        /**
         * 赠送贡献对话框销毁
         */
        showGiveGxianDialogDes: false,

        /**
         * ##贡献值颜色
         *- light-blue-普通用户颜色
         *- red-管理用户颜色
         */
        gieGxColor: 'light-blue',
        editGxianCount: '',//自定义赠送贡献值数量 
        /**
         * 弹窗类型 默认 0
         * - 0 赠送贡献值  
         * - 1 收藏
         */
        diaLog: 1,

        newStarModel: true,
        /**
         * 收藏夹弹窗显示
         */
        showNewStarModel: false,
        /**
         * 新建收藏夹类型
         * 0 - 内容
         * 1 - 音乐
         */
        newStaType: 0,

        /**
         * - standard
         * - bottom
         */
        diaLogPos: 'standard',
        /**
         * full-width 或 ''
         */
        diaLogClass: '',
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
         * ## 收藏夹弹窗激活的选项
         * @type {Number=0}
         * @description
         * - 0 内容
         * - 1 音乐
         */
        gxStarDialogModel: 0,
        /**
         * # 删除收藏夹加载状态
         */

        /**
         * !点赞
         */
        isUp: false,



        /**
       * !贡献列表
       */
        gxList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    }),

    getters: {
        createStarDialogShowType() {
            let fullWidth = false, width = '300px'

            if (Screen.xs) {
                fullWidth = true
                width = 'auto'
            }

            return {
                fullWidth,
                width,
            }
        },

        /**
         * 创建收藏夹按钮disabled 
         */
        crateStarBtnDisabled() {
            return newColsRule(this.createStarName) === true ? false : true
        },
        /**
        * 修改收藏夹按钮disabled 
        */
        upStarBtnDisabled() {
            return newColsRule(this.editStarObj.title) === true ? false : true
        },


        giveBtnDisabled() {
            if (this.giveGxType) {
                const isTrue = giveGxinRule(this.editGxianCount)
                if (isTrue === true) return false
                return true
            }
            if (this.giveGxianModel && this.giveGxianModel.length) return false
            return true
        },


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
         * model贡献迷你窗改变
         * @param {Number} v 
         */
        starListTransition(n, o) {
            // 清除原来的无用动画
            const batchs = getBatchs(anId)
            if (batchs && batchs.length) killBatchs(batchs)
            anId = ''

            // 创建新的列表动画
            const arr = []
            diaLogEl.value.forEach(el => arr.push(el.$el));
            anId = anInit(arr, '.now-scroll .scroll')
        },



        /**
         * !赠送贡献列表
         */

        /**
         * 列表加载更多事件
         * @param  index 
         * @param   done 
         */
        loadGiveGxList(index, done) {
            const childLen = giveGxianListEl.value.length

            const arr = [1, 2, 3, 5, 6, 7, 8, 9, 0]
            setTimeout(async () => {
                this.gxList.splice(this.gxList.length, 0, ...arr)
                await nextTick()
                const sliceArr = giveGxianListEl.value.slice(childLen),
                    batchArr = [];
                sliceArr.forEach(el => batchArr.push(el.$el));
                createBatch(batchArr, '.an-parent .scroll', anId, showBatch(.075, 'expoScale(0.5,7,power1.in)'))
                anRefresh()
                done()
            }, 1000);
        },

        /**
         * 赠送列表隐藏事件
         */
        giveGxianLishHideEv() {
            // 清空动画
            if (anId) killBatchs(getBatchs(anId))
            anId = ''
        },

        /**
         * 赠送贡献列表显示事件
         */
        giveGxianLishShoeEv() {
            const batchArr = [];
            giveGxianListEl.value.forEach(it => batchArr.push(it.$el))
            anId = anInit(batchArr, '.an-parent .scroll', showBatch(.075, 'expoScale(0.5,7,power1.in)'))
        },



        /**
         * !内容点赞
         */
        contentUpClick() {
            this.isUp = !this.isUp
        },

        /**
         * ! 赠送贡献输入框
         */
        gLiPtUserInputToggle() {
            this.giveGxType = !this.giveGxType

            if (this.giveGxType) return this.toggleInputTypeBtnTxt = '返回'

            this.toggleInputTypeBtnTxt = '自定义'
        },



        /**
         * !收藏
         */
        /**
         * 更新收藏夹信息
         */
        updateStarInfo() {
            const { img, id, title } = this.editStarObj
            console.log('更新收藏夹信息', img, id, title);
        },


        /**
         * # 打开收藏夹
         * @param {?Object} editInfo 编辑信息
         * @param {?Boolean} isEditStar 编辑状态 默认 false
         */
        openStarModel(editInfo, isEditStar = false) {
            this.editStarInfo = isEditStar
            this.showNewStarModel = true
            this.newStarModel = true

            if (editInfo) {
                const { img, id, title } = editInfo
                this.editStarObj = { img, id, title }
                console.log(this.editStarObj);
            }
        },

        /**
         * 新建收藏夹   
         */
        async createCollection() {

            let data = userNameReplace(this.createStarName), userStore = useUserInfoStore(),
                dataList = this.newStaType ? userStore.star.musicData : userStore.star.articleData,
                hasIndex = dataList.findIndex(it => it.title === data)

            if (hasIndex !== -1) return Notify.create({
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
            // 将创建信息添加到数组
            dataList.unshift({
                "tags": [],
                "img": '',
                "crateAuthor": "作者",
                "createDate": new Date().toLocaleTimeString(),
                "commons": [],
                "title": data,
                "id": new Date().getTime().toString(),
                "stars": []
            })
            this.newStarModel = false
            this.showNewStarModel = false
            this.createStarName = ''
            // useUserInfoStore().setDrag()

            await nextTick()
            const elConetn = diaLogEl.value
            if (!elConetn) return
            const el = elConetn[0].$el;
            createBatch(el, '.now-scroll .scroll', anId)
            anRefresh()
        },

        /**
         * 删除收藏
         * @param {number} 操作类型 0-内容 1-音乐 默认-0
         * @param {String} 删除的收藏id
         */
        delCollection(id, t = 0) {
            Dialog.create({
                title: "确定要删除该收藏夹吗？",

                color: "primary",
                ok: {
                    flat: true,
                    label: "是的",
                },

                cancel: {
                    unelevated: true,
                    label: "手滑",
                },

                focus: 'cancel',
                transitionShow: "slide-right",
                transitionHide: "slide-right",
            }).onOk(() => {
                const userStore = useUserInfoStore(),
                    dataList = t ? userStore.star.musicData : userStore.star.articleData,
                    hasIndex = dataList.findIndex(it => it.id === id)

                /** 
                 * !删除收藏夹，发起网络请求
                */
                if (hasIndex !== -1) {
                    Loading.show({
                        spinner: QSpinnerOrbit,
                        spinnerSize: 'lg',
                        message: '正在删除收藏夹...',
                    })
                    /** 
                     * !模拟删除收藏夹网络请求
                    */
                    setTimeout(() => {
                        console.log("删除收藏夹", dataList[hasIndex])
                        Loading.hide()
                        Notify.create({
                            progress: true,
                            position: 'center',
                            message: '已删除收藏夹',
                        })

                        dataList.splice(hasIndex, 1)
                    }, 1000);

                    return
                }

                Notify.create({
                    progress: true,
                    type: "warning",
                    position: 'top',
                    message: '删除失败',
                })

            })
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
        async diaShowEv() {
            if (!this.diaLog) return
            // 没有数据
            if (!diaLogEl.value) return

            // 创建列表动画
            const arr = []
            diaLogEl.value.forEach(el => arr.push(el.$el));
            anId = anInit(arr, '.now-scroll .scroll')
        },

        // 弹窗隐藏事件
        diaHideEv() {
            this.showGiveGxianDialogDes = false
            this.stars = this.selectStart
            if (!this.diaLog) return
            const batchs = getBatchs(anId)

            if (batchs && batchs.length) killBatchs(batchs)
            anId = ''
        },

        /**
         *  设置弹窗类型
         * @param Number t 0 赠送贡献值弹窗 | 1 收藏弹窗 
         */
        setDialog(t) {
            this.diaLog = t
            this.showGiveGxianDialogDes = true


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
            this.giveGxBtnLoad = true

            let count = this.giveGxianModel
            if (this.giveGxType) count = this.editGxianCount

            /**
             * !这里发起赠送贡献网络请求
             */
            setTimeout(() => {
                const res = Math.random() > .5

                if (res) {
                    Notify.create({
                        progress: true,
                        type: 'positive',
                        position: 'top',
                        message: '送出贡献值×' + count,
                        icon: 'check'
                    })

                    this.editGxianCount = ''
                    this.giveGxianModel = ''
                    this.showGiveGxianDialog = false
                } else {
                    Notify.create({
                        progress: true,
                        type: 'warning',
                        position: 'top',
                        message: '赠送失败请重试！',
                    })
                }

                this.giveGxBtnLoad = false
            }, 1000);
        }
    }
})


export default gloabStore

export {
    diaLogEl, giveGxianListEl
}