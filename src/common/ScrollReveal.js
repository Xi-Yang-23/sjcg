import ScrollReveal from "scrollreveal";

ScrollReveal.debug = true;
const sr = ScrollReveal()

const cfg = {
  distance: "50%",
  origin: "left",
  interval: 66,
  opacity: 0.1,
  container: ".scroll",
  cleanup: true,
  ease: "ease-in",
  reset: true,
  viewOffset: {
    top: 50,
  },
}

/**
 * 入场动画
 * @param {Element} el 动画元素
 * @param {Object} config 配置动画
 * @returns 开始入场动画
 */
const rev = (el, config = cfg) => sr.reveal(el, config)

/**
 * sr异步更新
 * @returns null
 */
const srSync = () => setTimeout(() => sr.sync(), 500);

export {
  sr,
  rev,
  srSync
}