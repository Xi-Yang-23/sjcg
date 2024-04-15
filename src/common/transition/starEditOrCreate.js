import gsap from "gsap"
import { ramEase } from "../../utils/animate"

/**
 * 元素进入前
 * @param {Object} cfg 
 * @returns function
 * @example 
 * //默认值
 * {
 *  opacity: 0,
 *  x: '-30%'
 * }
 */
const onBeforeEnter = (cfg = {
    opacity: 0,
    x: '-30%',
}) => el => gsap.set(el, cfg)


/**
 * 元素开始进入 
 * @param {Object} cfg 
 * @returns function
 * @example 
 * //默认值
 * {
 *  opacity: 1,
 *  ease: ramEase(),
 *  duration: .5,
 *  x: 0,
 * }
 */
const onEnter = (cfg = {
    opacity: 1,
    ease: ramEase(),
    duration: .5,
    x: 0,
}) => (el, done) => {
    const _cfg = cfg;
    _cfg.onComplete = done
    gsap.to(el, _cfg)
}

/**
 * 
 * @param {Object} cfg 
 * @example
 * //默认值
 * {
 *  opacity: 1,
 *  ease: ramEase(),
 *  duration: .5,
 *   x: '102%',
 * }
 * @returns function
 */
const onLeave = (cfg = {
    ease: ramEase(),
    opacity: 0,
    duration: .55,
    x: '102%',
}) => (el, done) => {
    const _cfg = cfg;
    _cfg.onComplete = done
    gsap.to(el, _cfg)
}

export {
    onLeave, onEnter, onBeforeEnter
}