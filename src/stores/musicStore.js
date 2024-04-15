import { defineStore } from 'pinia'
import { Dialog, Notify, Screen } from 'quasar';
import shufArr from '../utils/Array';
import { ref } from 'vue';


const musicVizCanvas = ref()

const musicStore = defineStore('musicStore', {
    state: () => ({
        /**
         * 音频采样 
         * - 默认 512
         */
        fftSize: 512,

        musicState: false,
        musicDiaShowModel: false,//音乐播放器界面 
        miniOffset: [0, 0],

        /**
         * !播放的下一曲，优先级最高
         * - type:Object
         */
        nextPlayMuisc: null,
        /**
         * 歌曲播放进度 0 - 1
         */
        musicProgress: 0.65,
        musicNowTime: '00:00',//歌曲播放实时的时间
        musicDuration: '00:00',//歌曲播放总时间 
        /**
        * !拖动时间轴
        */
        slideSelectTime: '00:00',


        playMusicName: '歌名歌名歌名歌名歌名歌名歌名歌名歌名',
        playMusicAuthor: '作者作者作者作者作者作者作者作者作者作者',


        musicPlatBtnLoading: false,
        playId: '',//音乐已加载完成，并且已播放音乐返回的id 
        musicSound: null,//当前播放的音乐实例

        /**
         * ### 歌曲播放顺序 
         * - 默认：0 
         * - 0 按顺序
         * - 1 单曲循环
         * - 2 随机
         */
        playType: 0,
        miniMusicPlayShow: false,//音乐迷你播放器 
        /**
         * 音乐列表
         */
        musicLists: [
            {
                img: '/testImg/photo0000-1246.jpg',
                avatar: '/testImg/photo0000-1246.jpg',
                author: '丁秀英沈静谢桂英史平曾明',
                title: '周济断王验正华验京段三容安群党火数商为解米属子安车团如布眼种最京支车到',
                listen: 3598,
                musicTime: '05:09',
                musicSrc: '/music/来来来.mp3',
                id: '540000200805012335'
            },
            {
                img: '/testImg/road-1072821_1920.jpg',
                avatar: '/testImg/bridge-336475_1920.jpg',
                author: '常杰徐军孔勇魏桂英',
                title: '做党毛学系见青已七整构资我般示期近马维复经体速这平应保同高认标节东车建将  科具明回受其外都长定元书应收斗较看会导斯住龙展放长引并商则头月就导文打无山题量装值因活  成更工些',
                listen: 8364,
                musicTime: '04:30',
                musicSrc: '/music/大天蓬 (抖音版).mp3',
                id: '140000201508105754'
            },
            {
                img: '/testImg/Car.jpg',
                avatar: '/testImg/QQ图片20221020083708.jpg',
                author: '蔡平',
                title: '火确学车海百际难月连金及圆整将照阶即但图易会称压总引越般达放走委门单准集 队计除风员主成低离容证定四花它产速可力式信政口门性百',
                listen: 3822,
                musicTime: '20:16',
                musicSrc: '/music/1.mp3',
                id: '210000197511148770'
            },
            {
                img: '/testImg/QQ图片20221020083629.jpg',
                avatar: '/testImg/QQ图片20221020083708.jpg',
                author: '毛丽高强姜秀兰',
                title: '百毛工北办传什人明要基规派门它准消包次素群美些安资亲件是度装拉以格群派色 必带派强眼参断亲般流引温议又酸听们表织金团产文还外些号音每亲步原题知社许包毛连加她图界 心保',
                listen: 2002,
                musicTime: '00:36',
                musicSrc: '/music/久宠不腻ni - 【3D环绕】抖音神曲，我不得不服.mp3',
                id: '82000019700905414X'
            },
            {
                img: '/testImg/QQ图片20221020083708.jpg',
                avatar: '/testImg/OIP-C.jpg',
                author: '段杰曹艳贺杰乔军',
                title: '层至快量八资根商种线你志里',
                listen: 1213,
                musicTime: '17:27',
                musicSrc: '/music/Arzu-official - EDG Rimex（热音版）.mp3',
                id: '420000198008019860'
            },
            {
                img: '/testImg/nature-1563305-wallhere.com.jpg',
                avatar: '/testImg/Car.jpg',
                author: '李涛崔艳',
                title: '书除验象你月革拉开社运战通结关并除位道次采好价应质有放除照般门亲是把商车 边入',
                listen: 9788,
                musicTime: '22:34',
                musicSrc: '/music/熊出没女声1.mp3',
                id: '650000201612012558'
            },
            {
                img: '/testImg/OIP-C.jpg',
                avatar: '/testImg/ripples-of-sand-in-black-and-white.jpg',
                author: '梁娜汤军邱军',
                title: '业引办战料什标元花从事织育正五类构片品府需细标统次发路就住车群文干标五元 ',
                listen: 7469,
                musicTime: '15:59',
                musicSrc: '/music/Arzu-official - EDG Rimex（热音版）.mp3',
                id: '310000197504258289'
            },
            {
                img: '/testImg/photo0000-1246.jpg',
                avatar: '/testImg/bridge-336475_1920.jpg',
                author: '乔杰阎秀英袁超郝明',
                title: '用线知写商于万先对件情车水还然老向八上单头平如历采又可学量满因观片团元导 ',
                listen: 9008,
                musicTime: '07:00',
                musicSrc: '/music/起风了编辑.wav',
                id: '520000201603261481'
            },
            {
                img: '/testImg/ripples-of-sand-in-black-and-white.jpg',
                avatar: '/testImg/road-1072821_1920.jpg',
                author: '李霞任秀英戴杰',
                title: '么正切及极人精得历持子须积内日放',
                listen: 2048,
                musicTime: '19:35',
                musicSrc: '/music/METAMORPHOSIS.mp3',
                id: '520000201906257172'
            }
        ],

        /**
         * 当前播放的音乐下标
         * 默认0
         */
        currPlayIndex: 0,
        /**
         * 当前播放的音乐id。针对非播放列表里的音乐激活
         */
        currPlayId: null,
        /**
        * ### 顺序播放下标+随机播放列表
        * - 下标0 顺序播放下标数组
        * - 下标1 随机播放下标数组
        */
        playIndexArr: [
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [7, 3, 8, 0, 5, 4, 2, 1, 6]
        ],

        /**
         * 是否处于切换播放方式
         */
        isToggleType: false,
        miniSwipeAn: true
    }),

    getters: {
        /**
         * 列表激活的下标
         */
        activeIndex() {
            let i = null
            if (this.playType === 2) {
                i = this.playIndexArr[1][this.currPlayIndex]
            } else {
                i = this.playIndexArr[0][this.currPlayIndex]
            }

            const { img, id, title } = this.musicLists[i]
            document.body.style.setProperty('--music-bg', `url(${img})`)
            this.currPlayId = id
            return {
                i,
                id,
                title,
                img
            }
        },

        /**
         * 背景设置
         */
        setMusicBg() {
            const playIndex = this.playType === 2 ? 1 : 0,
                playArr = this.playIndexArr[playIndex],
                { img } = this.musicLists[playArr[this.currPlayIndex]]
            document.body.style.setProperty('--music-bg', `url(${img})`)
            return img
        },


        /**
         * 播放的音乐标题
         * @returns String
         */
        musicTitle() {
            const t = this.playType === 2 ? 1 : 0,
                playArr = this.playIndexArr[t],
                playIndex = playArr[this.currPlayIndex];
            const { title } = this.musicLists[playIndex]
            return title
        },

        /**
         * 迷你播放器渲染的数据   
         */
        miniPlayRenderData() {
            // 随机
            if (this.playType === 2) return this.playIndexArr[1]

            // 按顺序 
            return this.playIndexArr[0]
        },

        /**
         * !操作栏、进度条相关
         */
        progressCfg() {
            const res = {
                vertical: false,
                proWid: 'calc(100vw - 140px - 240px - 200px)',
                contenHei: 'calc(100vh - 106px)',
                gonNengClass: '',
            }

            if (Screen.xs) {
                res.vertical = true
                res.proWid = Screen.width - 136 + 'px'
                res.contenHei = 'calc(100vh - 192px)'
                res.gonNengClass = 'full-width flex justify-between'
            }

            return res
        },

        /**
         * ! 歌曲播放图标与文本
         * @returns Object
         */
        playIconAndTxt() {
            let res = {}
            switch (this.playType) {
                case 0:
                    res = {
                        icon: 'r_repeat',
                        label: '按顺序'
                    }
                    break;

                case 1:
                    res = {
                        icon: 'r_repeat_one',
                        label: '单曲循环'
                    }

                    break;

                default:
                    res = {
                        icon: 'r_shuffle',
                        label: '随机'
                    }
                    break;
            }
            return res
        },

        /**
         * ! 播放按钮icon
         * @returns String
         */
        playIcon() {
            return this.musicState ? 'r_pause' : 'r_play_arrow'
        },

        /**
         * 音乐播放器尺寸
         */
        musicSize() {
            let pos = 'bottom',
                progressSize = '.2em',
                musicMiniWidthClass = 'mini-heriz-bottom window-width',
                musicMiniWidthStyle = 'auto',
                miniPad = 'row q-pl-sm cur-grab',
                miniCurStyle = 'cur-grab',
                miniShowNextPreBtn = false;

            if (Screen.gt.xs) {
                pos = 'top-right'
                musicMiniWidthStyle = '300px'
                musicMiniWidthClass = ''
                progressSize = 'sm'
                miniPad = '';
                miniCurStyle = 'cursor-pointer'
                miniShowNextPreBtn = true
            }

            return {
                pos,
                musicMiniWidthClass, progressSize,
                miniPad, musicMiniWidthStyle, miniShowNextPreBtn, miniCurStyle
            }
        },


    },

    actions: {
        /**
         * 进度条拖动事件
         * @param Number 0-1 val  
         */
        updateModel(val) {
            this.slideSelectTime = this.secToMins(200 * val)
        },

        /**
         * ! 设置歌曲播放时间
         */
        setMusicTime(seekTime) {
            player.seek(seekTime)
        },


        /**
         * 手动更新进度
         * @param {Number} val 0-1 滑动的进度
         */
        progressMoudelUp(val) {
            this.setMusicTime(200 * val)
        },

        /**
         * 迷你播放器滑动事件
         * @param {Number} n 
         * @param {Number} o 
         */
        miniSwipeEv(n, o) {
            if (this.isToggleType) return
            const playIndex = this.playType === 2 ? this.playIndexArr[1][n] : this.playIndexArr[0][n]
            this.player(playIndex)
        },

        /**
         * 秒转分钟
         * @param {Number} sec 秒数 
         * @return MM:ss 返回时间格式
         */
        secToMins(sec) {
            let m = parseInt(sec / 60 % 60)
            let s = parseInt(sec % 60)
            m = m < 10 ? '0' + m : m
            s = s < 10 ? '0' + s : s
            return `${m}:${s}`
        },

        /**
         * !歌曲播放方式切换
         */
        musicPlayTypeToggle() {
            this.isToggleType = true
            this.miniSwipeAn = false
            if (this.playType === 2) {
                this.playType = 0
            } else if (this.playType < 2) {
                this.playType++
            }

            let txt = '单曲循环'
            switch (this.playType) {
                case 0:
                    txt = '按顺序'
                    const findActiveIndex = this.playIndexArr[0].find(it => this.playIndexArr[1][this.currPlayIndex] === it);
                    this.currPlayIndex = findActiveIndex
                    break;

                case 2:
                    txt = '随机播放'
                    const preActiveVal = this.playIndexArr[1].findIndex(it => this.currPlayIndex === it);
                    this.currPlayIndex = preActiveVal
                    break;


            }

            Notify.create({
                message: txt,
                progress: true,
            })

            setTimeout(() => {
                this.miniSwipeAn = true
                this.isToggleType = false
            }, 200);
        },

        /**
         * 创建歌曲下标数组
         * @returns Array 歌曲列表下标
         */
        createMuiscArr() {
            const arr = []
            this.musicLists.forEach((it, i) => arr.push(i));
            return arr
        },

        /**
         * !音乐menu列表click事件
         * @param {Number} playIndex 音乐列表下标
         */
        musicMenuListPlay(playIndex) {
            // 点击播放中的歌曲， 暂停或开始播放 
            if (this.playId && playIndex === this.currPlayIndex) {
                const isPlay = this.musicSound.playing()
                isPlay ? this.musicSound.pause() : this.musicSound.play()
                return this.musicState = !isPlay
            }

            this.currPlayIndex = playIndex
            this.player(playIndex)
        },


        /**
         * 创建音乐实例，开始播放
         * @param {Number} playIndex 播放的音乐下标
         */
        player(playIndex) {
            /**
             * 播放新音频
             */
            this.musicPlatBtnLoading = true
            this.musicState = true

            /**
             * 获取当前播放的歌曲信息
             */
            const { musicSrc } = this.musicLists[playIndex]

            // 歌曲加载完成，开始播放
            setTimeout(() => {
                this.musicPlatBtnLoading = false
            }, 1200)
        },


        /**
         * 音乐大界面关闭
         */
        musicDiaLogClose() {
            if (!this.miniMusicPlayShow) this.miniMusicPlayShow = true
        },

        /**
         * !上一首
         */
        playPreMusic() {
            this.currPlayIndex === 0 ? this.currPlayIndex = this.musicLists.length - 1 : this.currPlayIndex--
            const playIndex = this.playType === 2 ? this.playIndexArr[1][this.currPlayIndex] : this.playIndexArr[0][this.currPlayIndex]
            this.player(playIndex)
        },

        /**
         * !下一首
         */
        playNextMusic() {
            this.currPlayIndex === this.musicLists.length - 1 ? this.currPlayIndex = 0 : this.currPlayIndex++
            const playIndex = this.playType === 2 ? this.playIndexArr[1][this.currPlayIndex] : this.playIndexArr[0][this.currPlayIndex]
            this.player(playIndex)
        },


        /**
         * !暂停+播放
         */
        async toggleMuiscPlay() {
            this.musicState = !this.musicState
        },


        /**
         * !从播放列表移除
         * @param {Number} musicIndex 删除的下标
         */
        delMusic(musicIndex) {
            if (musicIndex !== this.currPlayIndex) {
                this.musicLists.splice(musicIndex, 1)
                this.updateMusicPlayList(musicIndex)
                if (this.musicLists.length === 0) {
                    this.musicDiaShowModel = false
                    this.miniMusicPlayShow = false
                }
                return
            }


            Dialog.create({
                message: '要移除正在播放的歌曲吗？',
                cancel: true,
                focus: 'cancel'
            }).onOk(() => {
                this.musicState = false;
                this.musicProgress = 0
                this.musicNowTime = '00:00'
                this.musicLists.splice(musicIndex, 1)
                this.updateMusicPlayList(musicIndex)
                this.playId = null

                Notify.create({
                    position: 'top-right',
                    message: '已移除',
                    progress: true,
                })


                if (this.musicLists.length === 0) {
                    this.musicDiaShowModel = false
                    this.miniMusicPlayShow = false
                }
            })
        },


        /**
         * 更新播放列表
         * @addLenOrIndex Number 增加的数量 或 减少的下标
         * @t Number[0,1]? 默认 1 | 操作类型 (可选) 0 增加  | 1 减少 
         */
        updateMusicPlayList(addLenOrIndex, t = 1) {
            const musicLen = this.musicLists.length
            /**
             * 播放列表减少
             */
            if (t) {
                this.playIndexArr[0].splice(addLenOrIndex)
                for (let i = addLenOrIndex; i < musicLen; i++)this.playIndexArr[0].push(i)

                const delRamIndex = this.playIndexArr[1].findIndex(it => addLenOrIndex === it)
                this.playIndexArr[1].splice(delRamIndex, 1)
                this.playIndexArr[1].forEach((it, i) => it > addLenOrIndex ? this.playIndexArr[1][i]-- : '');
                if (this.currPlayIndex > 0 && this.currPlayIndex > addLenOrIndex) this.currPlayIndex--
                return
            }


            /**
             * 列表增加
             */
            const oldPlayListLeng = this.playIndexArr[0].length;

            // 更新顺序播放下标
            const update = [
                [],
                []
            ]
            // 随机
            for (let i = 0; i < addLenOrIndex; i++) {
                const ram = oldPlayListLeng + i;
                update[1].push(ram)
            }
            // 顺序 
            const nowIndex = addLenOrIndex - 1
            for (let i = nowIndex; i < musicLen - 1; i++) {
                const shunXu = i + 1
                update[0].push(shunXu)
            }
            this.playIndexArr[0].splice(addLenOrIndex, Infinity, ...update[0])
            /* if (addLenOrIndex === 1) {
                const ramNum = Math.floor(Math.random() * addLenOrIndex)
                return this.playIndexArr[1].splice(ramNum, 0, ...update[1])
            }
            [0, 1, 4, 2, 3] */
            update[1] = shufArr(update[1])
            this.playIndexArr[1].push(...update[1])
            console.log(this.playIndexArr);
            // 按顺序播放的当前播放下标
            if (!this.playType) this.currPlayIndex += addLenOrIndex
        },



        /**
        * !销毁音乐播放器
        */
        disMusicPlay() {
            Dialog.create({
                color: 'primary',
                message: '准备销毁音乐播放器、并停止播放歌曲吗？',
                ok: {
                    label: "手滑",
                    flat: false,
                    unelevated: true,
                },
                cancel: {
                    label: "是的",
                    flat: true,
                },
                transitionShow: 'slide-left',
                transitionHide: 'slide-right',
            }).onCancel(() => {
                this.miniMusicPlayShow = false
                this.musicDiaShowModel = false
                this.musicLists = []
                this.musicState = false
                Notify.create({
                    message: '已销毁音乐播放器',
                    progress: true,
                    position: 'top'
                })
            })
        },


        /**
        * todo 添加到下一首播放
        */
        musicNextPlay(muiscInfo) {
            console.log(muiscInfo);
            Notify.create({
                position: 'top',
                message: '已添加到下一首播放',
                progress: true
            })
        },

        /**
         * ! 添加音乐到播放列表
         * @muiscInfo Object|Array muiscInfo 添加的音乐
         */
        addMuisc(muiscInfo) {
            console.log('播放列表添加新音乐', muiscInfo, this.playIndexArr);
            const isArr = Array.isArray(muiscInfo)
            if (isArr) {
                this.musicLists.unshift(...muiscInfo)
                return this.updateMusicPlayList(muiscInfo.length, 0)
            }

            this.musicLists.unshift(muiscInfo)
            this.updateMusicPlayList(1, 0)
        }
    }
})




export default musicStore

export {
    musicVizCanvas
}
