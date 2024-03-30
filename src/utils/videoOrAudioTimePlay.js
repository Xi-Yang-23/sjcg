/**
 * 评论检索时间，提取时间，跳转视频、音乐播放
 */

/**
 * # 提取时间
 * @param {String} txt 文本
 * @returns Array 返回提取的时间数组,如下
 * @example
 * [
 *   '23:23', '23:23',
 *   '09:23', '12:23',
 *   '23:34', '12:23',
 *   '12:34', '23：76',
 *   '28：8'
 * ]
 * 
 */
const txtTimeToArr = txt => {
    const reg = new RegExp('(\\d*?[:：]+\\d+)', 'g')
    const timeArr = txt.match(reg)

    return timeArr
}

// let txt = '搜索技术大会上但实际上较低时34:34-56:12kdj djsjds dks d1:12-2:45'
let txt = '时34:34-56:12kdj djsjds dks d1:12-2:45'



/**
 * 生成视频、音频跳转按钮
 * @param {function} clickEv 按钮的click事件函数
 * @param {String} label 文本
 */
const createTimeBtnHtmlStr = (clickEvStr, label) => {
    const btnEl = document.createElement('button');

    btnEl.innerText = label
    btnEl.className = 'q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle text-blue q-btn--actionable q-focusable q-hoverable q-btn--dense'


    let res = btnEl.outerHTML
    res = res.replace('class', `onClick="${clickEvStr}" class`);
    return res
}

/**
 * 创建时间跳转的html字符串
 * @param {String} txt 检测的文本
 * @returns String 返回创建的结果
 */
const startCreateTxtAndBtn = txt => {
    const getTimeArr = txtTimeToArr(txt)

    if (!getTimeArr) return txt;

    getTimeArr.forEach(it => {
        const btn = createTimeBtnHtmlStr('console.log(' + it + ')', it)
        // const btn = createTimeBtnHtmlStr(() => console.log(it), it)
        txt = txt.replace(it, btn)
    });

    return txt
}


export default startCreateTxtAndBtn