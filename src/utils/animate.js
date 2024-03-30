import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


/**
 * 设置元素初始值
 * @param {Elements} batch  动画元素
 */
const hideBatch = batch => gsap.set(batch, { opacity: 0, x: "-15%" });

/**
 * 随机ease
 * @returns String
 */
const ramEase = (ease = ['circ.out', "circ.out", "expo.in", "bounce.out", "expoScale(0.5,7,power1.in)"]) => {
    const len = ease.length,
        ramEaseNum = Math.floor(Math.random() * len),
        nowEase = ease[ramEaseNum];
    return nowEase
}

/**
 * 显示动画的方法
 * @param {Element} batch 动画元素
 * @param {Number} del default:0 延迟
 */
const showBatch = (del = 0, ease) => {
    if (!ease) ease = ramEase()

    // 没有延迟
    if (!del) return batch => {
        gsap.to(batch, {
            ease,
            immediateRender: true,
            opacity: 1,
            x: 0,
            overwrite: true,
            duration: 0.5,
        });
    }

    // 延迟
    return batch => {
        batch.forEach((it, i) => {
            gsap.to(it, {
                ease,
                immediateRender: true,
                opacity: 1,
                x: 0,
                delay: i * .075,
                overwrite: true,
                duration: 0.5,
            });
        });
    }
};


/**
 * 列表动画
 * @param {Element} el 绑定动画的元素
 * @param {Element} scroller 滚动元素 父级
 * @param {String} id 当前组的动画id 默认null
 * @param {Function} show 显示动画函数
 * @param {Function} hide 隐藏动画函数
 * @param {Boolean} once 只触发一次 
 */
const createBatch = (el, scroller = ".scroll", id = null, show = showBatch(.0789), hide = hideBatch, once = false) => {
    hideBatch(el);
    ScrollTrigger.batch(el, {
        once,
        scroller,
        onEnter: show,
        onLeave: hide,
        onEnterBack: show,
        onLeaveBack: hide,
        id
    });
}


/**
 * 动画初始化
 * @param {element} el 元素或元素选择器 》监听的滚动元素 
 * @param {element} scroller 滚动高度，超出的滚动高度
 * @param {String} id default:null 设置的id，没有设置则随机返回一个
 * @returns id 返回当前动画的id
 */
const anInit = (el, scroller = ".scroll", id = null) => {
    if (!id) id = new Date().getTime().toString()
    createBatch(el, scroller, id);
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
 * @param {String} id 
 * @returns Array
 */
const getBatchs = id => ScrollTrigger.getAll().filter(it => it.vars.id === id)

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
    anInit, createBatch,
    getBatchs, killBatchs,
    disableOrenableBatchs,
    useIdfindBatchInfo, anRefresh
}