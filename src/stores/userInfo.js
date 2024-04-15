import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { nextTick, ref } from 'vue'
import Sortable from 'sortablejs';

const dragContentEl = ref()

const useUserInfoStore = defineStore('userInfo', {
    state: () => ({
        email: null,
        userName: null,
        token: null,
        avatar: null,
        bg: null,
        loginAlert: false,//登录弹窗
        uId: null,//用户uid 
        touristId: null,//游客的id，不是游客则携带token访问
        role: {},//权限
        sex: 0,
        online: -1,//在线状态 : -1 未知 | 0 离线 | 1 在线
        describe: null,//简介 

        /**
         * 激活的tab菜单
         * @article 内容(默认)
         * @music 音乐
         * @star 收藏
         * @shenHe 审核中
         */
        tabMenuModel: 'article',

        /**
         * 主页相关
         */
        /**
         * 收藏信息弹窗
         */
        starDiaModel: false,
        /**
         * 弹窗数据
         */
        starDiaDate: {},

        /**
         * 贴子内容
         */
        article: {
            /**
            * 贴子排序
            * - 0 最新
            * - 1 最热 
            */
            sort: 0,
            /**
             * 最大页数
             */
            maxpages: 6,
            /**
             * 总页数
             */
            max: 10,
            /**
             * 最新当前页数
             */
            newCurPage: 1,
            /**
            * 最热当前页数
            */
            hotCurPage: 1,
        },
        /**
         * 音乐
         */
        music: {
            /**
            * 音乐排序
            * - 0 最新
            * - 1 最热 
            */
            sort: 0,
            /**
             * 最大页数
             */
            maxpages: 6,
            /**
             * 总页数
             */
            max: 10,
            /**
             * 最新当前页数
             */
            newCurPage: 1,
            /**
            * 最热当前页数
            */
            hotCurPage: 1,
        },


        /**
         * 收藏的拖拽
         */
        starDrag: null,
        /**
         * 收藏
         */
        star: {
            /**
             * 内容收藏
             */
            articleData: [{ "tags": ["局而划", "才化"], "img": "/testImg/red roses.jpg", "crateAuthor": "邵磊周伟阎娟史磊", "createDate": "1998/05/02", "commons": ["120000201005164505", "520000199308298652", "420000201306132110"], "title": "确他决织维须省东省件争何步极复传部山从三难也题变律人好众", "id": "440000200911251256", "stars": ["520000198805064879"] }, { "tags": ["结同行", "区点", "书", "离点起山采"], "img": "/testImg/nature-1563305-wallhere.com.jpg", "crateAuthor": "胡娜贾芳", "createDate": "2023/08/24", "commons": ["610000198106018242", "120000201504163283", "350000200609307237", "140000201303218296", "230000201604048333", "610000199106113180", "710000200311023300", "110000201106014176", "220000201010295677"], "title": "米马速过", "id": "430000199701138864", "stars": ["710000197503151441", "420000197306207208", "820000200703297736", "23000019800711887X", "540000200207315352", "370000201912311325", "340000200210058249", "370000197901311013", "630000200202257132", "820000200408162222", "520000199610213189", "820000202012074487"] }, { "tags": ["选联确和石", "已她精", "马思料片然算"], "img": "/testImg/photo0000-1246.jpg", "crateAuthor": "丁军蒋磊杨强万超曹静胡平汤艳", "createDate": "2002/10/08", "commons": ["810000198909117428", "370000197310025971", "650000201211085764", "460000198209154468", "320000200010046186", "50000019720622748X"], "title": "在十斗派积问号对广业强地头 又运己华必声性节大至长众量", "id": "520000202009216543", "stars": ["360000199310051843", "650000200102117611", "460000199710285116", "420000202004101460", "640000202403217250", "530000199707157568", "620000197609235668", "420000201501082614", "230000198112185820", "81000020060131015X", "120000198908268642", "130000202212067771", "710000200103283140", "710000201609253517", "120000201706248437", "540000199408096314"] }, { "tags": ["命"], "img": "/testImg/bridge-336475_1920.jpg", "crateAuthor": "谢杰 段军黎敏姜强谭艳贺霞邵芳", "createDate": "1971/04/21", "commons": ["520000202209118657", "120000201404297153", "53000019880129250X"], "title": "育将亲象己通温看但支党马领制业议及基族", "id": "610000202012304140", "stars": ["420000198910038783", "810000198703302847", "500000201610292717", "640000198301018104", "120000201910113644", "34000020190430404X", "810000201509168589", "620000199907105318", "640000198411116178", "140000199006172543", "510000199104197583"] }],

            /**
             * 音乐收藏 
             */
            musicData: [{ "tags": ["单使适须", "总过半际", "导及西信克"], "img": "/testImg/OIP-C.jpg", "crateAuthor": "许杰", "createDate": "1973/03/28", "commons": ["330000199410108549", "640000201903053710", "150000199101197847", "110000200910100679", "610000197007159803", "370000197407202268", "810000201511010289", "350000201604044495", "310000197508155535"], "title": "北约照话治要口你任目总来做战广队构每走各速龙", "id": "110000201802171730", "stars": ["460000198201021492", "820000199405253529", "410000197001180014", "230000200205156682", "500000198709168930", "610000198711115382", "710000197002057289", "540000199404210503", "520000202304128407", "360000201505153348", "710000201001031545", "410000200303187590", "120000202007269153"] }, { "tags": ["导治政效", "张量价效", "提"], "img": "/testImg/QQ图片20221020083708.jpg", "crateAuthor": "余明金刚陆伟郑敏钱芳胡强戴娟", "createDate": "1985/01/18", "commons": ["650000201008200042", "110000197107305865"], "title": "农劳器京", "id": "150000198901234226", "stars": ["710000197508181754", "500000197604089692", "140000201203302925", "810000202002073120", "820000199111025168", "410000199802157323", "610000202208043333", "12000019890105019X", "710000198504141290", "430000200410236152", "310000201302218878", "320000197609034777", "310000197010291839", "310000199709081316", "54000020010324617X", "650000201312226861", "310000200706208882", "330000199901307614"] }, { "tags": ["天", "置六更"], "img": "/testImg/Hatsune-Miku-1503769-wallhere.com.jpg", "crateAuthor": " 李艳刘刚", "createDate": "2021/11/03", "commons": ["820000200507174181", "450000200305126844", "43000019940902849X", "320000198401317211"], "title": "华小务电么外心化观众级身调外眼始导确", "id": "230000197109295442", "stars": ["65000019971206315X", "330000201206053624", "540000199610024576", "460000198610302631", "520000197302272671", "990000201501273577", "710000197507212985", "420000198608208745", "370000198103111732"] }],


            /** 
             * ## 收藏夹当前激活的选项
             * @type {Number=0}
             * @description
             * - 0 内容
             * - 1 音乐
             */
            activeModel: 0
        }
    }),
    persist: {
        paths: ['email', 'userName', 'token', 'avatar', 'bg', 'uid', 'role', 'sex', 'describe'],//持久化  
    },

    getters: {

    },

    actions: {
        /**
         * tab切换事件
         * @val String 当前激活的事件name
         */
        TabsCheckEv(val) {
            if (val === 'star') this.setDrag()
        },

        /** 
         * 设置拖拽
         */
        async setDrag() {
            console.log("setDrag ~ setDrag:",)
            if (this.starDrag) this.starDrag = null

            await nextTick()
            this.starDrag = new Sortable(dragContentEl.value.$el, {
                group: "user-drag",  // 拖拽名称组
                animation: 520,  //动画过渡
                easing: "cubic-bezier(0, 0.55, 0.45, 1)", //缓动效果
                handle: ".drag-handle",  // 拖拽句柄
                draggable: ".drag-item",  // 拖拽元素class
                forceFallback: true,//取消半透明状态
                ghostClass: "draging-hide",  // 拖拽的元素class，固定的不会跑的那个元素
                dragClass: "draging-show",  //拖拽中的元素clas,拖着到处跑的那个元素
                onSort: evt => {
                    const { oldIndex, newIndex } = evt
                    /**
                     *  this.star.activeModel 激活的排序
                     */
                    this.refReshStarDataSort(oldIndex, newIndex)
                }
            });
        },

        /**
         * !处理网络请求 ，刷新收藏排序
         * 刷新收藏的数据排序
         * @param {Number} oldIndex 旧下标
         * @param {Number} newIndex 新下标
         */
        refReshStarDataSort(oldIndex, newIndex) {
            const absVal = Math.abs(oldIndex - newIndex),
                upData = this.star.activeModel ? this.star.musicData : this.star.articleData

            if (absVal > 1) {
                const data = upData[oldIndex]
                upData.splice(oldIndex, 1)
                upData.splice(newIndex, 0, data)
            } else {
                upData.splice(oldIndex, 1, ...upData.splice(newIndex, 1, upData[oldIndex]))
            }

            /**
             * !处理收藏排序的网络请求
             */
            console.log("处理收藏排序的网络请求:", upData)
        },


        /**
         * 收藏tab-panels切换事件
         */
        async starTransition(name) {
            this.setDrag()
        },


        /**
         * 收藏夹弹窗
         */
        openStarDiaModel() {
            this.starDiaModel = true
        },

        /**
         * 主页设置置顶
         * @param Number [t?] 默认-0 | 设置置顶类型=>(0-内容置顶 | 1-音乐置顶 | 2-收藏置顶)
         */
        setTop(t = 0) {
            Notify.create({
                position: 'center',
                message: '已置顶'
            })
        },

        /**
        * 主页取消置顶
        * @param Number [t?] 默认-0 | 设置置顶类型=>(0-内容置顶 | 1-音乐置顶 | 2-收藏置顶)
        */
        canleTop(t = 0) {
            Notify.create({
                position: 'center',
                message: '取消置顶'
            })
        },
    }
})


export default useUserInfoStore

export {
    dragContentEl
}