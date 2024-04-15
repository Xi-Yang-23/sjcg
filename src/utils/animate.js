import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


/**
 * 设置元素初始值
 * @param {Object} cfg  default：{ x: "-15%", opacity: 0 } | 动画初始值的配置对象
 * @returns {Function} @functionSet 返回一个动画函数的set 
 * 
 * ## 返回的函数参数↓
 * @functionSet 
 * @param {Element} batch  动画元素  
 */
const hideBatch = (cfg = { x: "-15%", opacity: 0 }) => batch => gsap.set(batch, cfg)

/**
 * 随机ease
 * @returns String
 */
const ramEase = (ease = ["expo.out", "circ.in", 'circ.out', "expo.in", "bounce.out", "expoScale(0.5,7,power1.in)", "power2.in", "power3.in", "sine.in"]) => {
    const len = ease.length,
        ramEaseNum = Math.floor(Math.random() * len),
        nowEase = ease[ramEaseNum];
    return nowEase
}

/**
 * 显示动画的方法
 * @param {Number} stagger default:0 动画列表延迟
 * @param {String} ease 缓动效果 ，默认随机
 * @param {Number} duration default:0.5 动画过渡时间
 * @returns function 返回动画函数
 */
const showBatch = (stagger = 0, ease, duration = .5) => {
    if (!ease) ease = ramEase()
    return batch => gsap.to(batch, {
        ease,
        immediateRender: true,
        opacity: 1,
        x: 0,
        overwrite: true,
        duration,
        stagger
    });
};


/**
 * 列表动画
 * @param {Element} el 绑定动画的元素
 * @param {Element} scroller 滚动元素 父级
 * @param {String} id 当前组的动画id 默认null
 * @param {Function} show 显示动画函数
 * @param {Function} hide 隐藏动画函数
 * @param {Boolean} once default:false 为true动画只触发一次 
 * @returns Array 返回创建的实例数组
 */
const createBatch = (el, scroller = ".scroll", id = null, show = showBatch(.0789), hide = hideBatch(), once = false) => {
    hideBatch()(el);

    let cfg = {
        once,
        scroller,
        onEnter: show,
        onLeave: hide,
        onEnterBack: show,
        onLeaveBack: hide,
        id,

    }

    if (once) cfg = {
        once,
        scroller,
        onEnter: show,
        id,
    }

    return ScrollTrigger.batch(el, cfg);
}


/**
 * 动画初始化
 * @param {element} el 元素或元素选择器 》监听的滚动元素 
 * @param {element} scroller 滚动高度，超出的滚动高度
 * @param {Function} show 显示动画函数
 * @param {Function} hide 隐藏动画函数
 * @param {Boolean} once default:false 为true动画只触发一次 
 * @param {String} id default:null 设置的id，没有设置则随机返回一个
 * @returns id 返回当前动画的id
 */
const anInit = (el, scroller = ".scroll", show = showBatch(.0789), hide = hideBatch(), once = false, id = null) => {
    if (!id) id = new Date().getTime().toString()
    createBatch(el, scroller, id, show, hide, once)
    return id
};

/**
 * 删除动画batchs
 * @param {Array} batchs 删除的动画batchs 
 * @param {Boolean} killAll default:false   删除所有动画
 */
const killBatchs = (batchs, killAll = false) => killAll ? ScrollTrigger.killAll() : batchs.forEach(it => it.kill());

/**
 * 禁，启用动画
 * @param {Array} batchs 元素列表
 * @param {Number} t  default:0  | 0 禁用 | 1 启用
 */
const disableOrenableBatchs = (batchs, t = 0) => t ? batchs.forEach(it => it.enable(true)) : batchs.forEach(it => it.disable());


/**
 * 查询指定id值的Batch
 * @param {String} id [可选] default:undefined 查询动画实例
 * @returns Array
 */
const getBatchs = id => id ? ScrollTrigger.getAll().filter(it => it.vars.id === id) : ScrollTrigger.getAll()

/**
 * 查询动画信息
 * @param {String} id 配置id
 * @returns Object
 */
const useIdfindBatchInfo = id => ScrollTrigger.getById(id)

/**
 * 刷新动画
 */
const anRefresh = () => ScrollTrigger.refresh()


export {
    hideBatch,
    anInit, createBatch,
    getBatchs, killBatchs,
    disableOrenableBatchs,
    useIdfindBatchInfo, anRefresh,
    showBatch, ramEase
}