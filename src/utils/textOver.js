// 文本超出隐藏，显示按钮

/**
 * # 初始化状态
 * @param {Object} cfg 配置 默认↓
 * *cfg配置参考
 * @active String|number default:1 初始值，动态改变的数值，例如： 1 2 3.... 。none 没有限制
 * @show boolean default:fasle 显示、隐藏展开按钮。 true 显示 | false 隐藏
 * @once boolean defalut:false  true:只触发一次，触发一次后销毁展开按钮 false:触发多次
 * @lines String|number defalut:1 要显示的行数
 * @dis false boolean defalut:false 销毁展开按钮
 * @example
 * {
 *  active: 3,//当前激活的值 可以是数字 可以是none
 *  show: false,//绑定的复选框值
 *  lines: 3,//显示的行数
 *  dis: false,
 *  once: true,
 *  isOver: false,
 *}
 */
const textOverInit = (essOutEl, cfg, index = 0) => {
    for (let i = index; i < essOutEl.length; i++) {
        const it = essOutEl[i];
        const { $el } = it,
            { firstChild } = $el;
 
        const nowCfg = cfg[i],
            { lines } = nowCfg;

        /**
         * !只显示一行，只对比宽度
         */
        if (lines === 1) {
            const getParWid = $el.offsetWidth,
                getChilWid = firstChild.offsetWidth;
            // 父级宽度大于子级，销毁展开按钮，并销毁数组示例
            if (getParWid > getChilWid) nowCfg.dis = true;
            continue;
        }

        /**
         * !显示多行，对比高度
         */
        const getParHei = $el.offsetHeight,
            getChilHei = firstChild.offsetHeight;

        // 子级高度小于等于父级高度，销毁展开按钮，并销毁数组示例
        if (getChilHei <= getParHei) nowCfg.dis = true;
    }
};

/**
 * 文本超出按钮的click事件
 * @param {Object} it 当前点击的配置
 */
const textOverOpenClick = it => {
    const { lines, once } = it;
    it.show === true ? it.active = "none" : it.active = lines
    if (once) it.dis = true;
};

export {
    textOverInit,
    textOverOpenClick,
}