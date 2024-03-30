import { emjioList } from "../common/reply";
import noReArr from "./noArr";

/**
 * 1. 将at信息转为a标签
 * 2. 将表情转img标签
 * @param {Array} arr at的数组信息
 * @param {String} txt 评论的文本
 * @param {String} linkClass 默认 at-user text-blue | a标签class
 * @param {String} linkTarget 默认 _blank | a标签跳转方式
 * @returns String 返回替换的at信息与表情html
 */
const commentAtAndEmjio = (
    arr,
    txt,
    linkClass = "at-user text-blue",
    linkTarget = "_blank"

) => {
    let replaceComment = txt;
    // at信息转a标签处理
    arr.forEach(it => {
        const { uName, uid } = it;
        const createA = document.createElement("a");
        createA.href = uid;
        createA.id = `at${uid}`;
        createA.className = linkClass;
        const nema = uName.replace(`(${uid})`, '')
        createA.innerText = nema;
        createA.target = linkTarget;
        const aElToString = createA.outerHTML;
        replaceComment = replaceComment.replace(uName, aElToString);
    });

    replaceComment = replaceEmjioToImg(replaceComment)
    return replaceComment;
};

/**
 * 文本替换为emjio表情
 * @param {String} imgClass 默认 emjio-img |　img标签class
 * @param {String} txt 检测的文本
 * @returns String 返回转换的文本
 */
const replaceEmjioToImg = (txt, imgClass = "emjio-img") => {
    // 提取表情
    const reg = new RegExp("\\[.*?]", "gi");
    // 数组去重
    const emjioStrArr = txt.match(reg);

    // 没有表情则返回
    if (!emjioStrArr) return txt;

    const noReEmjioArr = noReArr(emjioStrArr);
    noReEmjioArr.forEach((it) => {
        const createImg = document.createElement("img");
        const { src } = emjioList.find((it2) => it2.name === it);
        createImg.src = src;
        createImg.setAttribute('data-name', it)
        createImg.className = imgClass;
        const imgElToString = createImg.outerHTML;

        // 替换表情
        txt = txt.replaceAll(it, imgElToString);
    });

    return txt;
}

/**
 * # 输入框里的html转文本
 * - at 转 @昵称(uid)
 * - emjio 转 [表情]
 * @param {Element} el 输入框的父级
 * @param {Boolean} atToStr at信息转字符，默认false
 * @returns Object 返回转换的数据
 * @example
 *  {
 *     at: [],
 *     txt: ''
 * }
 */
const replyElToStr = (el, atToStr = false) => {
    el = el.cloneNode(true)
    // 获取a元素
    const getA = el.querySelectorAll('a'),
        getAllImgs = el.querySelectorAll('img');

    const msg = {
        at: [],
        txt: ''
    }

    // a标签 |　a标签转为@用户昵称 + 提取at的用户id,push到at
    if (atToStr && getA.length) {
        // 将a标签转为@用户昵称 + 提取at的用户id,push到at
        getA.forEach(it => {
            const uName = it.innerText
            const uid = it.id.substring(2)
            const atInfo = `${uName}(${uid})`
            msg.at.push({
                uName: atInfo,
                uid,
            })

            const range = new Range()
            const unameNode = document.createTextNode(atInfo)
            range.selectNode(it)
            range.deleteContents()
            range.insertNode(unameNode)
            range.detach()
        })
    }

    let str = el.innerHTML;
    // 图片转字符
    if (getAllImgs) {
        getAllImgs.forEach(it => {
            const imgElToStr = it.outerHTML
            const getEmjioName = it.getAttribute('data-name')
            str = str.replace(imgElToStr, getEmjioName)
        })

        msg.txt = str
    }

    return msg
}

export default commentAtAndEmjio
export {
    replaceEmjioToImg,
    replyElToStr
}