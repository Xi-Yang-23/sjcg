import { computed, nextTick, ref } from "vue";
import axios from "axios";
import { anInit, anRefresh, createBatch, getBatchs, hideBatch, killBatchs, ramEase, showBatch } from "../utils/animate";
import { Screen, debounce, scroll, format } from "quasar";
import formatDates from "../utils/formateDate";
import musicStore from "../stores/musicStore";
import { findArrIndex } from "../utils/Array";

const useMusicStore = musicStore();

const { setVerticalScrollPosition } = scroll
const { humanStorageSize } = format
/**
 * 元素进入视图动画过渡
 */
const once = false,//Screen.xs?true:false
    ease = ramEase(),
    anShow = showBatch(.075, ease),
    anHide = hideBatch({ x: Screen.xs ? '-16%' : '-75%', opacity: 0 });

const tuiJian = ref([]),
    code = ref([]),
    music = ref([]),
    activeMusicItemIndex = ref(-1);


/**
 * 动画元素
 */
const anBoxEl = ref([]);


const faXianTabs = [
    {
        label: "推荐",
        name: "tuijian",
    },

    {
        label: "码力",
        name: "code",
    },

    {
        label: "音乐",
        name: "music",
    },
];

// 存储tab滚动位置
const scrollPos = [];
/**
 * 初始化tab滚动位置 
 */
const scrollInit = () => faXianTabs.forEach(it => scrollPos.push(0));
scrollInit()

const activeTabs = ref(faXianTabs[0].name)
const infiniteScroll = ref()

// 当前激活的tab下标
const activeTabIndex = () => faXianTabs.findIndex(it => it.name === activeTabs.value)

let anId = ''//动画id
const loadData = async (index, done) => {
    /**
     * !加载数据，发起网络请求
     */
    const el = anBoxEl.value,
        anElLen = el.length;

    const nowIndex = activeTabIndex();
    setTimeout(async () => {
        let { data, finish } = await axios.get(`/home/${nowIndex === 2 ? 'music' : 'qd'}`);
        if (!finish) data = formateTxt(data.lists)

        switch (nowIndex) {
            case 0:
                tuiJian.value.push(...data);
                break;
            case 1:
                code.value.push(...data);
                break;
            default:
                music.value.push(...data);
                //音乐列表无需动画
                return done();
        }

        /**
         * ?给元素添加动画
         */
        await nextTick()
        const anArr = [];
        if (!anId) {
            el.forEach(it => anArr.push(it.$el));
            anId = anInit(anArr, '.scroll', anShow, anHide, once)
        } else {
            const arr = el.slice(anElLen)
            arr.forEach(it => anArr.push(it.$el))

            createBatch(anArr, '.scroll', anId, anShow, anHide, once)
            anRefresh()
        }
        done();
    }, 600);
};

const renderData = computed(() => {
    const nowIndex = activeTabIndex();

    switch (nowIndex) {
        case 0:
            return [...tuiJian.value]
        case 1:
            return [...code.value]

        default:
            return [...music.value]
    }
})

/**
 * 数据格式化
 */
const formateTxt = arr => {
    arr.forEach(it => {
        const { likes, see, date } = it
        if (Number(see) >= 1000) it.see = humanStorageSize(see).replace('B', '').toLocaleLowerCase()
        if (Number(likes) >= 1000) it.likes = humanStorageSize(likes).replace('B', '').toLocaleLowerCase()
        it.date = formatDates(date)
    })

    return arr
}

/**
 * ?tabs切换加载数据 
 */
const toggleTabs = async (val) => {
    // 删除动画实例，释放内存 
    if (getBatchs()) killBatchs('', true)
    anId = ''

    await nextTick()
    // 切换tab还原滚动位置   
    setVerticalScrollPosition(document.querySelector('.scroll'), scrollPos[activeTabIndex()])
    // setVerticalScrollPosition(document.querySelector('.scroll'),0)

    const el = anBoxEl.value,
        anElLen = el.length;


    // 可视区没有元素，则加载数据
    if (!anElLen) return infiniteScroll.value.poll()
    if (val === 'music') return


    // 给可视区元素恢复动画
    const anArr = [];
    el.forEach(it => anArr.push(it.$el));
    anId = anInit(anArr, '.scroll', anShow, anHide, once)
}

/**
 * 记录每个tab最后的滚动位置
 * @param {Number} pos y走滚动位置 
 */
const scrolled = pos => scrollPos[activeTabIndex()] = pos
const dbScroll = debounce(scrolled, 200)

/**
 * 音乐列表点击
 * @param {Object} it 音乐信息
 * @param {Number} i 点击的下标
 */
const musicItemClick = (it, i) => {
    if (!useMusicStore.miniMusicPlayShow) useMusicStore.musicDiaShowModel = true
    if (activeMusicItemIndex.value === i) return useMusicStore.toggleMuiscPlay()

    const { id } = it
    const isAdded = findArrIndex(useMusicStore.musicLists, 'id', id)

    let playeIndex = 0
    /**
     * 没有添加过此音乐到播放列表 
     */
    if (isAdded === -1) {
        useMusicStore.addMuisc(it)
    } else {
        useMusicStore.playType === 2 ? playeIndex = useMusicStore.playIndexArr[1].find(it => it === isAdded) : playeIndex = isAdded
    }
    useMusicStore.musicState = true
    useMusicStore.currPlayIndex = playeIndex
    activeMusicItemIndex.value = i
    useMusicStore.player(useMusicStore.currPlayIndex)
}


export default faXianTabs
export {
    activeTabs,
    activeTabIndex,
    loadData,
    renderData,
    music, tuiJian,
    toggleTabs,

    anBoxEl,
    infiniteScroll,

    dbScroll, activeMusicItemIndex, musicItemClick
}