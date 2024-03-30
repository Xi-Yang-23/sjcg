import { debounce, Notify } from 'quasar'
import { reactive, ref, nextTick, computed, watch } from 'vue'
import { theme } from "../stores/themeStore";
import commentAtAndEmjio, { replaceEmjioToImg, replyElToStr } from '../utils/commentAtAndEmjio';
import { comments } from './comments';
import formatDates from '../utils/formateDate';
const themeStore = theme();

const textAreaEl = ref()//文本框元素  
const xuNiTextareaEl = ref()//文本框元素  
const commentBoxEl = ref()//评论区父组件
let sel = getSelection(), // 获取选区
    range = null,//节点
    isIntersecting = true;//视频是否在可视区内 | true 在  | false不在

const commentOnIn = ev => isIntersecting = ev.isIntersecting

/**
 * 评论组件相关信息
 */
const replyInfo = reactive(
    {
        // 发送信息的按钮状态
        subCommentLoading: false,
        placehodel: '评个小论吧！',//输入框placehodel
        /** 
         * # 评论的回复对象+评论数据
         * - child 子级评论数据
         * - parent 父级评论数据
         */
        replyData: {},
        showReplyInput: false,//显示输入框

        /**
         * - 选中的at列表id
         * - 前端请求的互关数组
         * - 前端搜索的艾特列表
         * 
         * 1. 初始化渲染艾特列表
         * 2. 搜索时渲染过滤的at列表
         */

        xuNiTeatareaTxt: '',//虚拟输入框文本
        checkAtArr: [],//艾特的用户id列表,用作复选框 
        atMaxLen: 5,//最多可以艾特5个
        // 后端请求的互关用户列表
        atUserLists: [
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
            {
                uName: String(Math.random()).substring(2),
                id: String(Math.random()).substring(2),
                disabled: false,
            },
        ],
        showAt: false,//艾特显示选择成员
        atSearchTxt: "",//文本框输入时@的关键词
        filterAtList: [],//过滤的at列表,用作输入框触发@弹窗渲染数据
        atInputArr: [],//输入框at的a标签数据

        comments: '',//输入的html评论
        showBars: false,//显示操作栏
        fileImg: '',//选择的图片
        rangPos: 0,//光标位置
        diaLogType: -1,//弹窗类型 -1 没有任何弹窗   | 0 艾特  | 1 emjio表情 | 2 评论 | 3 收藏的图片  | 4 评论主题 
        showDelLikeImgBtn: false,//显示删除收藏的图片按钮
    }
)

// 大屏评论框配置
const bigReplyCfg = reactive({
    showTabs: false,
    showReply: false,
})



/**
 * 艾特按钮click事件
 * async
 */
const atClk = async () => {
    replyInfo.showAt = true
    await nextTick()

    //没有节点
    if (!range) {
        // 创建节点
        range = new Range()
        // 选择textAreaEl.value节点的子节点
        range.selectNodeContents(textAreaEl.value)
        // 将选取的子节点添加到选区
        sel.addRange(range)
    }
}

/**
 * 虚拟评论框点击
 */
const xuNiReplyClk = async () => {
    replyInfo.showReplyInput = true
    await nextTick()

    textAreaEl.value.innerHTML = replyInfo.comments

    // 没有任何回复栏操作，再将光标聚焦输入框尾部
    if (replyInfo.diaLogType === -1) return textAreaFoucusEnd(true)

    // 将光标移到尾部，但不聚焦
    return textAreaFoucusEnd(false)
}

/**
 * 渲染的at列表
 * @returns Array
 */
const renderAtList = computed(() => {
    // 处于搜索at状态，优先渲染搜索列表
    if (replyInfo.atSearchTxt !== '') return replyInfo.filterAtList

    // 未处于搜索at状态，渲染后端请求的互关列表
    return replyInfo.atUserLists
})

/**
 * 计算动画class
 */
const replyAn = computed(() => {
    const atLen = replyInfo.checkAtArr.length

    let isMaxAt = false
    atLen === replyInfo.atMaxLen ? isMaxAt = true : isMaxAt = false

    return {
        tipShowOrHide: {
            'tip-show': replyInfo.showAt,
            'text-red tip-max': isMaxAt
        },
        atLen
    }
})

/**
 * 监听已艾特列表
 * # at标签插入规则
 * - 生成a标签,插入到标签对应位置
 * 
 * # at标签删除,插入规则
 * 1. at数组列表减少,查找减少的id,根据id查找到文本框里的a标签,将其删除
 * 2. at列表增加,将增加的数据push到at数组,然后将a标签插入到选区
 * 3. 输入框删除艾特成员,正则查找a标签,匹配data-id属性,没有的同步at数组,at数组同步删除
 */
watch(() => replyInfo.checkAtArr, (n, o) => {
    const nLen = n.length,
        el = textAreaEl.value;

    /**
     * # 是否超过规定at数量
     */
    const execAtLen = nLen >= replyInfo.atMaxLen

    /**
     * 判断@列表是否可选中。
     * - t1、已被at，at名额未满，可以取消选择
     * - t2、已被at，at名额已满，可以取消选择
     * - t3、未被at，at名额已满，不可选择
     * - t4、未被at，at名额未满，可取消选择  ↓↓↓↓↓↓↓↓
     */
    replyInfo.atUserLists.forEach(it => {
        // 是否在艾特列表里
        const isAt = n.findIndex(v => v === it.id),
            t1 = isAt !== -1 && !execAtLen,
            t2 = isAt !== -1 && execAtLen,
            t3 = isAt === -1 && !execAtLen

        // t1 t2 t3
        if (t1 || t2 || t3) return it.disabled = false

        // t3 
        it.disabled = true
    })
    // ↑↑↑↑↑↑↑↑↑↑↑

    if (!el) return
    // 检测是否增加@成员
    watchAddAtNode(n, o)
    // 检测是否减少@成员
    watchDelNode(n, o)

    replyInfo.comments = el.innerHTML
}
)

/**
 * emjio列表click
 * @param {String} emjioUrl emjio地址
 * @param {String} emjioName emjio编号
 */
const emjioListClk = async (emjioUrl, emjioName) => {
    const getImg = await createImgEmjio(emjioUrl, emjioName)
    insertNode(getImg)

    replyInfo.comments = textAreaEl.value.innerHTML
    // 触发html转文本
    commentsHtmlToTxt()
}

/**
 * 插入emjio或at的a链接 
 * @param {Element} insertEl 插入的元素
 */
const insertNode = insertEl => {
    //没有节点
    if (!range) {
        // 创建节点
        range = new Range()
        // 选择textAreaEl.value节点的子节点
        range.selectNodeContents(textAreaEl.value)
        // 将选取的子节点添加到选区
        sel.addRange(range)
    }

    // 插入节点
    range.insertNode(insertEl)
    // 将光标移动到节点后
    range.setStartAfter(insertEl)
    // 折叠节点
    range.collapse(true)

    //释放节点状态，提高性能  
    return range.detach()
}

/**
 * 真实输入框click事件事件
 * @returns 
 */
const replyClick = async ev => {
    const clickEl = ev.target,//点击的元素
        clickElType = clickEl.nodeName//点击的元素类型

    // 聚焦关闭表情选择弹窗  
    replyInfo.diaLogType = -1

    // 获取当前点击的选区+节点
    sel = getSelection()
    range = sel.getRangeAt(0)

    //  点击的是a标签,选中a标签
    if (clickElType === 'A') {
        range.selectNode(clickEl)
        //释放节点状态，提高性能  
        return range.detach()
    }


    // 点的是图片 -> 将光标聚焦到图片后面
    if (clickElType === 'IMG') {
        // 聚焦到图片节点后面
        range.setStartAfter(clickEl)
        // 闭合光标
        range.collapse(true)
        //释放节点状态，提高性能  
        return range.detach()
    }
}

/**
 *  创建一个img元素
 * @param {String} src 图片地址
 * @param {String} emjioName emjio名称
 * @param {String} emjioClass emjio的className
 * @returns 返回一个img元素
 */
const createImgEmjio = async (src, emjioName, emjioClass = 'emjio-img') => {
    const img = new Image()
    // 设置图片属性
    img.src = src
    img.className = emjioClass
    img.setAttribute('data-name', emjioName)

    await img.decode();//等待图片创建完成，并可以插入到dom后再返回，以免图片插入失败
    return img
}

/**
 * 喜欢的收藏表情点击
 * @param {Number} t 操作类型 | 0 添加喜欢的表情 | 1 操作删除表情 | 2 点击已收藏的表情 | 3 开始删除表情弹窗
 * @param {String} imgSrc 图片地址
 * @param {Number} imgId 图片id
 */
const likeImgClk = (t, imgSrc, imgId) => {
    switch (t) {
        // 添加表情
        case 0:

            break;

        // 1 删除表情
        case 1:
            // alert(0)
            replyInfo.showDelLikeImgBtn = !replyInfo.showDelLikeImgBtn
            break;
        // 2 点击已收藏的表情
        default:
            replyInfo.fileImg = imgSrc
            isImg()
            break;
    }
}

/**
 * # 大屏输入框聚焦+ 失焦
 * @param {EVent} ev ev事件
 */
const bigInputFocusAndBlur = ev => {
    const { type } = ev
    switch (type) {
        // 失焦
        case 'blur':
            // bigReplyCfg.showTabs = false

            break;

        // 聚焦 
        default:
            bigReplyCfg.showTabs = true
            break;
    }
}

/**
 * 检测是否有图片
 */
const isImg = () => {
    let html = replyInfo.xuNiTeatareaTxt
    if (html.substring(0, 4) !== '[图片]' && replyInfo.fileImg.length) {
        replyInfo.xuNiTeatareaTxt = '[图片]' + html
    }
}

/**
 * 操作栏点击
 * @param {Number} t 操作类型 |　 0 艾特 ｜ 1 emjio点击　｜　2 评论　｜ 3 收藏的图片 
 */
const replyBarClk = t => {
    switch (t) {
        // 0 艾特 
        case 0:
            break;

        //  3 收藏的图片 | 1 emjio操作栏点击
        case 1:
        case 3:
            if (replyInfo.diaLogType === t) {
                replyInfo.diaLogType = -1

                return textAreaEl.value.focus()
            }

            replyInfo.diaLogType = t
            break;

        // 2 评论
        case 2:
            break;
    }
}

/**
 *粘贴事件
 */
const pasteEv = ev => {
    ev.preventDefault();
    let paste = (ev.clipboardData || window.clipboardData).getData("text");

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(paste));
    selection.collapseToEnd();

    paste = replaceEmjioToImg(paste)
    replyInfo.comments = paste

    textAreaEl.value.innerHTML = replyInfo.comments
    commentsHtmlToTxt()

    // 光标聚焦输入框尾部
    textAreaFoucusEnd(true)
}


/**
 * # 光标聚焦到输入框尾部
 * @param {Boolean} focus 默认 flase | true 聚焦到尾部且弹起键盘 | false 仅聚焦到尾部，
 * @returns null
 */
const textAreaFoucusEnd = (focus = false) => {
    const input = textAreaEl.value;

    // 创建节点
    range = new Range()
    // 选择textAreaEl.value节点的子节点
    range.selectNodeContents(input)
    const lastChild = input.lastChild
    if (lastChild) {
        const { endOffset } = range
        range.setStart(input, endOffset)
        range.setEnd(input, endOffset)
    }
    sel = getSelection()
    /**
     * 聚焦到尾部
     * 1. 使用selectNodeContents选中父节点 
     * 2. 设置setStart,setEnd,第一个参数选父级,第二个参数选range的endOffset
     * 3. 获取选区 sel = getSelection()
     * 4. 将选中的选区删除sel.removeAllRanges()
     * 5. 将当前选中的节点添加到选区sel.addRange(range)
     * 6. 折叠选区range.collapse(true)
     * 7. 聚焦
     */
    sel.removeAllRanges()
    sel.addRange(range)
    range.collapse(true)
    range.detach()

    if (focus) return input.focus();

    return input.blur()
}

/**
 *复制事件|剪切事件
 */
const copy = ev => {
    const selection = document.getSelection();
    ev.clipboardData.setData("text/plain", selection.toString());
    return ev.preventDefault();
}

/**
 * # 发送评论按钮
 * 
 * ## 1. 评论
 *  - 没有回复任何人
 *  - 直接发送
 * 
 * ## 2. 回复评论的父级
 *  - 获取父级下标
 *      - 找不到则视为评论已删除，弹出提示用户回复失败，并且删除回复的引用信息
 *  - 找到，返回父级下标
 *      - 生成用户信息
 *      - 评论文本转html
 *      - 添加到以父级下标的comments评论数组
 * 
 * ## 3. 回复评论的子级
 *  - 获取父级下标
 *      - 找不到则视为评论已删除，弹出提示用户回复失败，并且删除回复的引用信息
 *  - 获取子级下标
 *      - 找不到则视为评论已删除，弹出提示用户回复失败，并且删除回复的引用信息
 *  - 找到子级
 *      - 生成用户信息
 *      - 评论文本转html
 *      - 添加到以父级下标的comments的子评论下标数组
 *  - 评论发布成功，清初始化引用信息与文本框
 */
const sendMsg = async () => {
    replyInfo.subCommentLoading = true

    const creaDiv = document.createElement('div');

    replyInfo.fileImg.length ? creaDiv.innerHTML = replyInfo.xuNiTeatareaTxt.slice(4) : creaDiv.innerHTML = replyInfo.xuNiTeatareaTxt

    const msg = replyElToStr(creaDiv, true)
    msg.txt = htmlStrToStr(msg.txt)
    msg.img = replyInfo.fileImg

    const tm = ['macDark', 'macLight', '']
    // 回复父级评论 
    const obj = {
        IP: '苏州',
        date: formatDates(new Date().getTime()),
        msg,
        isDel: false,
        up: Math.round(Math.random() * 100),
        userInfo: {
            authIcon: '',
            avatar: '/avatar.jpeg',
            sex: Math.round(Math.random()),
            uName: String(Math.random()).slice(2, 6),
            title: '',
        }
    }

    // 随机主题
    obj.commentTheme = tm[Number((Math.random() * (tm.length - 1)).toFixed())]


    // 评论转表情与at信息
    msg.txt = commentAtAndEmjio(msg.at, msg.txt)

    /**
     * 1.没有回复，直接评论 | 父级主题会自动替换class
     */
    if (!Object.keys(replyInfo.replyData).length) {
        obj.parentId = new Date().getTime().toString()
        obj.childCount = 0

        obj.msg = msg

        // 视频不在可视范围内
        if (!isIntersecting) commentBoxEl.value.$el.scrollIntoView({ behavior: "instant", block: "start" })

        setTimeout(() => comments.value.unshift(obj), 200);

        return resetReplyInfo()
    }


    const { parent, child } = replyInfo.replyData,
        { parentId } = parent;


    const findParentCommentIndex = comments.value.findIndex(it => it.parentId === parentId)


    /**
    * 找不到回复则视为评论已删除，弹出提示用户回复失败，并且删除回复的引用信息
    */
    if (findParentCommentIndex === -1) return sendFail()
    const getParentComment = comments.value[findParentCommentIndex]

    // 子级主题class
    switch (obj.commentTheme) {
        case "macDark":
            obj.theme = "mac-dark";
            break;

        case "macLight":
            obj.theme = "mac-light";
            break;
        default:
            obj.theme = "";
            break;
    }


    /**
     *  3. 回复评论的子评论 
     * !这里处理父级回复评论的子评论 网络请求 | 发送评论请求
     */
    if (child) {
        const { childId } = child;

        const getChildComment = getParentComment.child
        const findChildCommentIndex = getChildComment.findIndex(it => it.childId === childId)

        // 评论被删除过
        if (findChildCommentIndex === -1) return sendFail();

        obj.childId = new Date().getTime().toString()
        const { isDel, msg, userInfo } = getChildComment[findChildCommentIndex]
        const { uName, uid } = userInfo

        // 引用回复的子评论的数据
        obj.replyCommentMsg = {
            msg,
            uName,
            uid,
            isDel
        }

        if (!getParentComment.child) getParentComment.child = []

        setTimeout(() => getParentComment.child.splice(findChildCommentIndex + 1, 0, obj), 200);

        getParentComment.childCount++
        return resetReplyInfo()
    }

    /**
     *  2. 回复评论的父级
     * !这里处理父级网络请求 | 发送评论请求
     */
    obj.childId = new Date().getTime().toString()
    if (!getParentComment.child) getParentComment.child = []

    setTimeout(() => getParentComment.child.unshift(obj), 200);

    getParentComment.childCount++
    return resetReplyInfo()
}

/**
 * 提示用户评论发送失败+初始化相关数据
 */
const sendFail = () => {
    replyInfo.subCommentLoading = false
    Notify.create({
        message: '发送失败，回复的评论已被删除！',
        type: 'warning',
        progress: true,
        position: 'top'
    })
    bigReplyCfg.showReply = false
    return replyInfo.replyData = {}
}

/**
 * 重置输入的评论数据
 */
const resetReplyInfo = () => {
    textAreaEl.value.innerHTML = ''
    replyInfo.showReplyInput = false
    replyInfo.subCommentLoading = false
    replyInfo.checkAtArr = []
    replyInfo.fileImg = ''
    replyInfo.comments = ''
    replyInfo.xuNiTeatareaTxt = ''
    replyInfo.showAt = false
    bigReplyCfg.showReply = false
    closeReplyComment()
}

/**
 * html标签转义
 * @param {Stirng} str 要转换的html字符
 * @returns String 返回转义的html字符串
 * 
 * @example
 * //<div>转<br/>
 * replace(/(<div>)/gi,'<br/>;')
 * //删除</div>
 * replace(/(<\/div>)/gi,'');
 * //空格转为' ' 
 * replaceAll('&nbsp;', ' ') 
 * //超过2换行，只保留2换行 
 * replace(/(<br\/?>){2,}/,'<br><br>') 
 * //空格超过3个，只保留2空格
 * replaceAll(/\s{3,}/gi, "  ")
 * //HTML标签转义，不转义<br/> 
 * replace(/<(?!br\/?>)/gi, '&lt;').replace(/(?<!<br\/?)>/gi, '&gt;') 
 */
const htmlStrToStr = str => str.replace(/(<\/div>)/gi, '').replaceAll('&nbsp;', ' ').replaceAll(/\s{3,}/gi, "  ").replace(/(<div>)/gi, '<br>').replace(/<(?!br\/?>)/gi, '&lt;').replace(/(?<!<br\/?)>/gi, '&gt;').replace(/(<br\/?>){2,}/gi, '<br><br>').trim()


/**
 * # 输入框的html转文本
 * - 表情 [表情名]
 * - 图片 压缩低于900k,转base64
 * - html标签转义
 * - @ 转为 @昵称。
 */
const commentsHtmlToTxt = () => {
    const el = textAreaEl.value;

    if (!el) return

    const { txt } = replyElToStr(el)

    replyInfo.xuNiTeatareaTxt = txt
    isImg()
}

/**
 * 转换html到文本防抖
 */
const dbsCommentHtmlToTXt = debounce(commentsHtmlToTxt, 1000)

/**
 * 查找增加的at成员 
 * @param {Array} newArr 新的at列表id
 * @param {Array} oldArr 上一次的at列表id
 * 
 * - 对比atListIdArr，inputAtArr
 *      - newArr 旧的at数组
 *      - oldArr 新的at数组
 * - atCheckIdArr的length大于inputAtArr的length
 *      - 判定为增加@数量。
 *      - 将增加的at数量添加到光标位置
 */
const watchAddAtNode = (newArr, oldArr) => {
    const oLen = oldArr.length
    const nLen = newArr.length

    // at列表增加 | 触发@
    if (nLen > oLen) {
        let addAtId = null
        newArr.some(it => {
            const addIndex = oldArr.findIndex(it2 => it2 === it)
            if (addIndex === -1) {
                addAtId = it
                return true
            }
        });

        if (!addAtId) return


        // 查询增加的at成员
        const findAddAtIndex = replyInfo.atUserLists.findIndex(it => it.id === addAtId)

        // 当前艾特的用户昵称
        const nowAtUname = replyInfo.atUserLists[findAddAtIndex].uName

        const pushObj = {
            uName: `@${nowAtUname}`,
            id: replyInfo.atUserLists[findAddAtIndex].id,
        }
        replyInfo.atInputArr.push(pushObj)

        /**
         * 触发@
         * 生成a标签
         */
        const createLink = createAtLink(pushObj.id, pushObj.uName)

        /**
         * 触发@的相关操作。
         * - 比如输入的是@123
         * - 弹出12345用户
         * - 选中12345用户后，将@123替换为@12345，并插入a链接
         * 
         * # 处理艾特符号  
         * - 从右往左检索(lastindexOf)当前节点文本的@符号下标。
         * - 检索位置不超过endOffset偏移量
         *    - 检索成功
         *        - 获取@符号到光标位置的文本(不包括@符号)，与文本长度 
         *        - 获取当前@的用户名称，截取用户下标0到位置@符号到光标位置的文本长度的字符。
         *        - 利用截取的文本与@符号到光标位置的文本对比。
         *               - 对比成功，创建a标签，对比用户名替换@符号+用户昵称为a标签的html内容，注意：a标签后面一定要加上空格符号(&nbsp)，便于删除时高亮at成员
         *               - 对比失败，若触发@，不做任何操作，创建a标签，添加at格式到输入框
         */
        const getStartCon = range.startContainer,
            curVal = getStartCon.nodeValue,//光标位置节点文本
            endOf = range.endOffset;//光标结束位置

        // 如果curVal不为null
        if (curVal) {
            //检索@符号位置位置
            const findAtLastIndex = curVal.lastIndexOf('@', endOf - 1);

            // 检索成功
            if (findAtLastIndex !== -1) {
                // 获取@符号到光标位置的文本(不包括@符号)，与文本长度
                const atToCurTxt = curVal.substring(findAtLastIndex + 1, endOf),
                    // 与文本长度
                    atToCurLen = atToCurTxt.length,
                    // 获取当前@的用户名称，截取用户下标0到位置@符号到光标位置的文本长度的字符
                    getUnameAtToCurTxt = nowAtUname.substring(0, atToCurLen);

                // 截取的字符与用户昵称一样
                if (getUnameAtToCurTxt === atToCurTxt) {
                    // 设置节点开始位置与结束位置
                    range.setStart(getStartCon, findAtLastIndex)
                    range.setEnd(getStartCon, endOf)
                    // 删除输入的at文本 
                    range.deleteContents()
                }
            }
        }

        // 创建空格节点，以空格分开便于删除at成员
        const space = document.createTextNode('\xa0')
        // 插入链接
        insertNode(createLink)
        // 插入链接后面的空格
        insertNode(space)

        // 触发html转文本
        commentsHtmlToTxt()
    }
}

/**
 * watch监听是否取消选中at列表
 * @param {Array} newArr 新数组
 * @param {Array} oldArr 旧数组 
 */
const watchDelNode = (newArr, oldArr) => {
    const oLen = oldArr.length
    const nLen = newArr.length

    // at列表减少,删除输入框节点,取消选中
    if (nLen < oLen) {
        let addAtId = null
        oldArr.some(it => {
            const addIndex = newArr.findIndex(it2 => it2 === it)
            if (addIndex === -1) {
                addAtId = it
                return true
            }
        });
        if (!addAtId) return

        // 查询减少的at成员
        const findFewAtIndex = replyInfo.atUserLists.findIndex(it => it.id === addAtId)
        // 取消减少的成员选中
        replyInfo.atUserLists[findFewAtIndex].disabled = false

        // 找到减少的用户元素
        const getInputAtEl = textAreaEl.value.querySelector(`#at${addAtId}`)

        if (!getInputAtEl) return

        // range = new Range()
        // range.selectNodeContents(textAreaEl.value)
        // 选中减少的用户元素
        range.selectNode(getInputAtEl)
        // 删除减少的用户元素
        range.deleteContents()
        // 折叠光标
        range.collapse(true)
        // 释放range,提高性能
        range.detach()
        // 触发html转文本
        commentsHtmlToTxt()
    }
}

/**
 * 监控输入框的@的文本节点是否完整。
 * @param {Element} el 输入框元素
 * @param {Array} atInputArr 输入框at的成员列表
 * 
 * # 监控规则
 * 1. 获取输入框里所有a标签
 * 2. 获取input的at数组的用户名称
 * 3. 对比输入框里的a标签文本与at的数组用户名
 *      - 遍历输入框里的所有a标签
 *      - 查询是否有断截的at成员
 *      - 有断截
 *          - 获取a标签里的文本节点
 *          - 删除a标签，再将a标签里的文本节点插入到原来起始位置
 *          - 根据a标签的id，删除at的数组信息
 */
const inputAtNodeIsGood = (el, atInputArr) => {
    // 触发html转文本
    commentsHtmlToTxt()

    // 获取所有艾特的a标签
    const getAllAEl = el.querySelectorAll('a')
    if (!getAllAEl.length) return

    // 遍历所有a标签
    getAllAEl.forEach(it => {
        const id = it.id.substring(2)
        const atUname = it.innerText

        const findUserInfo = atInputArr.find(it2 => it2.id === id)

        if (findUserInfo) {
            const { uName } = findUserInfo
            // 如果输入框的a标签文本节点与atInputArr用户名不同
            if (atUname !== uName) {
                //获取断截的昵称
                const getUname = el.querySelector(`#at${id}`).innerText
                // 创建文本节点
                const crateTextNode = document.createTextNode(getUname)

                // 选中该标签
                range.selectNode(it)
                // 将起始位置与结尾位置解构出来
                // const { endOffset, startOffset } = range
                // 删除该标签
                range.deleteContents()//删除节点
                range.insertNode(crateTextNode)//插入节点
                range.setStartAfter(crateTextNode)//将光标移动到节点前
                range.collapse(true)//合并光标
                range.detach()//释放range，提高性能 
            }
        }
    })
}

/**
 * 删除at的数组元素 | 删除输入框at的node节点
 * @param {Element} el 输入框元素
 * @param {Array} checkAtArr 复选框选中的at的成员　
 */
const inputDelAtNode = (el, checkAtArr) => {
    // 获取输入框所有a标签
    const getContentAllAElArr = el.querySelectorAll('a')

    // 触发html转文本
    commentsHtmlToTxt()

    //getContentAllAElArr没有length，且checkAtArr也没有视为已删除所有@   
    if (!getContentAllAElArr.length && checkAtArr.length) {
        // 删除输入框@节点 | 互关列表复选框取消选中
        checkAtArr.some(id => {
            // 查询删除的at对象index
            const findDelIndex = replyInfo.atUserLists.findIndex(it2 => it2.id === id)
            // 取消选中
            replyInfo.atUserLists[findDelIndex].disabled = false

            // 获取减少的成员节点
            const getDelEl = el.querySelector(`#at${id}`)

            if (getDelEl) {
                // 选中节点
                range.selectNode(getDelEl)
                // 删除节点
                range.deleteContents()
            }

        })

        // 输入框at成员设为空
        replyInfo.atInputArr = []
        // 复选框at的成员设为空
        return replyInfo.checkAtArr = []
    }

    // getContentAllAElArr有长度 | 逐个删除
    if (getContentAllAElArr.length) {
        // 提取所有a标签id 
        const getAElArrs = []//存储a标签id的数组
        const delAtArrIndex = []//删除的数组下标
        getContentAllAElArr.forEach(it => getAElArrs.push(it.id));

        /**
         * # 删除的元素
         * 1. 对比at列表数组id
         * 2. 提取at列表没有对应a元素的id值
         *  
         * @example
         * //下面是简化代码的原始代码，上面代码看不懂可参考下面注释的代码
         * const delIdArr = arr.filter((it, i) => {
         *      // 找相同的元素
         *      const isDel = getAElArrs.find(it2 => it2.substr(2) === it)
         *      // 不相同的，也就是被删除的，都返回
         *      if (!isDel) return delAtArrIndex.push(i)
         * })
         */
        // 简化代码 |　看不懂？？看不懂请看上面注释的原始代码 ↑↑↑↑↑↑
        const delIdArr = checkAtArr.filter((it, i) => (!getAElArrs.find(it2 => it2.substr(2) === it)) ? delAtArrIndex.push(i) : false)


        // 删除复选框at的成员 
        delAtArrIndex.forEach(it => replyInfo.checkAtArr.splice(it, 1))

        // 删除的数组长度-1
        const delIdArrLen = delIdArr.length - 1

        // 删除输入框@节点 | 互关列表复选框取消选中
        replyInfo.atUserLists.some((it, i) => {
            // at的成员已删除，不再继续遍历 
            if (i === delIdArrLen) return true

            // 查询删除的at对象
            const isNowId = delIdArr.find(id => it.id === id)

            // 找到已删除的at的id
            if (isNowId) {
                // 取消选中
                replyInfo.atUserLists[i].disabled = false

                // 查询减少的at成员
                const findMinusAtIndex = replyInfo.atInputArr.findIndex(it => it.id === isNowId)
                replyInfo.atInputArr.splice(findMinusAtIndex, 1)

                // 获取减少的成员节点 |  document.getElementById(isNowId);
                const getDelEl = el.querySelector(`#at${isNowId}`)
                // 选中节点
                range.selectNode(getDelEl)
                // 删除节点
                range.deleteContents()
            }
            return false
        })
    }
}

/**
 * 输入框input事件事件  
 * # 最多艾特 
 *  - 最多艾特5人，满5人时，文本框输入艾特符号将不弹出艾特选项框
 *  - 只能通过点击艾特按钮弹出at选项框
 * 
 * # 艾特的触发方式
 * - 光标前第一个字符出现@字符.
 * - 弹出艾特成员选项 
 * 
 * # @触发规则.
 * - 从光标处的下标开始，使用lastindexOf('@',光标位置)方法从右往左查找@字符.
 * 1. 光标处与@字符之间的length大于20(不包括@字符在内)，则停止@触发，并关闭@成员选项。因为用户名最多20字符
 * 2. 光标处与@字符之间空格数量大于3(不包括@字符在内)，停止@触发，并关闭@成员选项。因我方项目规定用户昵称空格不能超过3个。 
 * 
 * 3. 若光标处与@字符之间的length小于20、且光标处与@字符之间空格小于3.
 *     - 则触发@成员选项.
 *     - 截取@字符到光标处的字符.
 *     - 将截取的字符模糊匹配互关的用户昵称
 *     - 匹配成功，显示成员
 *     - 3.1 若用户选择艾特的成员 -> 把选择的成员添加到一个数组存储。
 *     - 然后生成一个a标签，添加成员id到a标签的id，把成员昵称插到光标处
 *     - 3.2 若取消选择成员，查找输入框里对应a标签id，然后删除数组，再删除输入框a标签
 * 
 * # 输入框输入流程
 * 1. 点击虚拟框
 * 2. 弹出真实输入框
 * 3. 获取真实输入框
 * 4. 设置真实输入框光标 + 选区
 * 5. 将输入的html存储到变量
 * 
 * # 记录选区数据
 * 1. 点击真实输入框,记录选区数据
 * 2. input事件,记录选区数据
 * 3. 插入表情,记录选区数据
 * 4. 插入链接,记录选区数据
 * 
 * # 输入的文本转换
 * ## 1. html转文本
 *      - 输入艾特信息
 *          - data-id 记录艾特的用户id
 *          - data-uName 记录艾特的用户昵称
 *      - 输入emjio表情
 *          - data-src 记录图片src地址
 *          - data-emjio-name 表情名称 [表情名]
 * 
 * ## 2. 真实发送信息转换 | 发送文本过滤 
 * 1. 将emjio表情转换为 -> [表情名]
 * 2. at信息转为数组 ->  [{id:123,uName:'用户昵称'}] 
 * 3. 将表情图片转为base64存储,表情图一般都是经过压缩上传,小于1mb.
 * 4. 过滤标签,把标签过滤成$lt,$gt.
 *  
 * # @删除规则。
 * 1. 通过选择复选框
 * 2. 通过click、input事件判断的是否为a标签
 *      - 是a标签，用户点击删除，将整个a标签删除
 * 
 * 
 * # @触发规则原始代码参考。
 * @example
 * 
 *  if (typeof nodeVal === 'string' && nodeVal !== '') {
 *       // at符号下标位置
 *       const atIndex = nodeVal.lastIndexOf('@', of - 1);
 * 
 *       // 如果找到
 *       if (atIndex !== -1) {
 *           const curPosFromAtLen = of - atIndex
 *
 *           // 1. 光标处与@字符之间的length大于20，则停止@触发
 *           if (curPosFromAtLen > 20) return replyInfo.showAt = false
 *
 *           // 2. 光标处与@字符之间空格数量大于3,则停止@触发 |　截取@字符到光标之间的字符（不包括@字符） 
 *           const getAtToCurPosStr = nodeVal.substring(atIndex + 1, of)
 *           // 匹配@字符到光标处的空格，正则匹配，将所有空格组成一个数组
 *           const getSpaceArr = getAtToCurPosStr.match(/\s/g)
 *           // @字符到光标处空格的数量
 *           const curPosFromAtSaapceCount = getSpaceArr !== null && getSpaceArr.length
 *           // 空格大于3，停止@触发
 *           if (curPosFromAtSaapceCount > 3) return replyInfo.showAt = false
 *
 *
 *           // 设置搜索的at文本
 *           replyInfo.atSearchTxt = getAtToCurPosStr
 *
 *           // 3. 若光标处与@字符之间的length小于20、且光标处与@字符之间空格小于3，正常触发@，弹出选择成员
 *           replyInfo.showAt = true
 *
 *           //  模糊匹配
 *           const filterArr = varueFilter(getAtToCurPosStr, replyInfo.atUserLists)
 *           // 匹配成功
 *           if (filterArr.length > 0) return replyInfo.filterAtList = filterArr
 *
 *           // 没有匹配at列表 ，清空搜索列表+搜索文本
 *           return replyInfo.filterAtList = []
 *       }
 *   }
 *
 *   // 没有搜索的at信息
 *   replyInfo.atSearchTxt = ''
 *   return replyInfo.showAt = false
 * 
 */
const replyInput = debounce(() => {
    sel = getSelection()// 实时获取选区内容
    range = sel.getRangeAt(0)// 实时获取节点

    const of = sel.focusOffset,//当前光标位置，从1开始
        nodeVal = sel.focusNode.nodeValue,//当前节点的文本  
        el = textAreaEl.value;//文本框元素 

    // 判断是否为a标签
    isAElAndSelectNode()
    // 检测输入框艾特信息是否完整
    inputAtNodeIsGood(el, replyInfo.atInputArr)
    // 检测是否删除@成员
    inputDelAtNode(el, replyInfo.checkAtArr)
    // 触发html转文本 
    dbsCommentHtmlToTXt()
    // 检测是否有图片
    isImg()

    replyInfo.comments = el.innerHTML

    // 检测触发@
    const resChangeAtSearchTxt = chageAt(nodeVal, of)

    // 触发@
    if (resChangeAtSearchTxt !== null) {
        // 设置搜索的at文本
        replyInfo.atSearchTxt = resChangeAtSearchTxt

        // 3. 若光标处与@字符之间的length小于20、且光标处与@字符之间空格小于3，正常触发@，弹出选择成员
        replyInfo.showAt = true

        //  模糊匹配
        const filterArr = varueFilter(resChangeAtSearchTxt, replyInfo.atUserLists)
        // 匹配成功
        if (filterArr.length > 0) return replyInfo.filterAtList = filterArr

        // 没有匹配at列表 ，清空搜索列表+搜索文本
        return replyInfo.filterAtList = []
    }

    // 没有搜索的at信息
    replyInfo.atSearchTxt = ''
    return replyInfo.showAt = false
}, 100)

/**
 * 检测触发@选择列表。
 * @param {String} nodeVal 光标处的文本节点
 * @param {Number} endOfset 光标处的结束值
 * @returns String 检测到@，返回@搜索的文本。 | null 未检测到@
 */
const chageAt = (nodeVal, endOfset) => {
    /**
  * 弹起at成员选择
  * 确保nodeVal是字符串，且不为空
  */
    if (typeof nodeVal === 'string' && nodeVal !== '') {
        // at符号下标位置
        const atIndex = nodeVal.lastIndexOf('@', endOfset - 1);

        // 如果找到
        if (atIndex !== -1) {
            const curPosFromAtLen = endOfset - atIndex

            // 1. 光标处与@字符之间的length大于20，则停止@触发
            if (curPosFromAtLen > 20) return null

            // 2. 光标处与@字符之间空格数量大于3,则停止@触发 |　截取@字符到光标之间的字符（不包括@字符） 
            const getAtToCurPosStr = nodeVal.substring(atIndex + 1, endOfset)
            // 匹配@字符到光标处的空格，正则匹配，将所有空格组成一个数组
            const getSpaceArr = getAtToCurPosStr.match(/\s/g)
            // @字符到光标处空格的数量
            const curPosFromAtSaapceCount = getSpaceArr !== null && getSpaceArr.length
            // 空格大于3，停止@触发
            if (curPosFromAtSaapceCount > 3) return null

            // 3. 若光标处与@字符之间的length小于20、且光标处与@字符之间空格小于3，正常触发@，返回光标要搜索的文本
            return getAtToCurPosStr
        }
    }
    // 未检测到@
    return null
}

/**
 * 判断是否为a标签，是则选中 ，并返回true，反之
 * @returns Boolean true 是at | false 不是at
 * # 判断规则
 * ### 1、input事件判断
 * - 触发input事件
 * - 判断光标后第一个字符是否为空格
 *     - 是空格
 *         - 检索光标前是否为a标签
 *             - 是a标签，则为at成员 
 *             - 选中a标签若删除时，会将整个a标签删除
 * ### 2、click事件判断
 * - 触发click事件
 *      - 判断点击的是否为a标签
 *          - 是a标签，则是@成员。
 *              - 选中a标签  
 */
const isAElAndSelectNode = () => {
    // 获取光标前的起始节点
    const getStartNode = range.startContainer
    // 获取光标前的起始节点的节点名称
    const getStartNodeTypeName = getStartNode.parentNode.nodeName
    // 是a标签
    if (getStartNodeTypeName === 'A') {
        // 选中节点，返回true
        range.selectNode(getStartNode)
        return true
    }

    // 非a标签，返回false
    return false
}


/**
 * 过滤艾特列表 | 模糊匹配数组
 * @param {String} regStr 匹配的字符
 * @param {Array} arr 后端请求的互关列表
 * @returns Array 返回匹配的数组，没有匹配到返回空数组
 * 
 * @example
 * varueFilter('hello',['abc','123','hello'])
 */
const varueFilter = (regStr, arr) => {
    if (regStr.length === 0) return []


    const resArr = arr.filter(it => {
        const { uName } = it
        const res = uName.match(new RegExp(regStr, 'gi'))
        if (res) return it
    })
    return resArr
}

/**
 * 创建一个a标签
 * @param {String} id id
 * @param {String} txt at名称
 * @returns element 返回一个a标签加空格符
 */
const createAtLink = (id, txt) => {
    const creatA = document.createElement('a')
    creatA.href = 'javascript:void(0)';
    creatA.id = `at${id}`
    creatA.className = 'at-user text-blue'
    creatA.innerText = txt
    return creatA
}

/**
 * 选择图片按钮
 */
const fileImg = file => {
    const el = textAreaEl.value
    // 选好图片，将光标定位到上一次的位置 
    file.pickFiles()

    if (replyInfo.diaLogType !== -1) return

    // 开启延时为了保证聚焦
    setTimeout(_ => el.focus(), 300);
}

/**
 * 选择图片更新事件
 */
const fileImgUpdata = val => {
    const windowURL = window.URL || window.webkitURL,
        blob = windowURL.createObjectURL(val);
    replyInfo.fileImg = blob
    isImg()
};

/**
 * 清除选择的图片
 */
const clearImg = _ => {
    replyInfo.fileImg = ''
    // 清除图片，将光标定位到上一次的位置
    const el = textAreaEl.value
    el.focus()
    replyInfo.xuNiTeatareaTxt = replyInfo.xuNiTeatareaTxt.replace('[图片]', '')
};


const emjioList = [{ "name": "[嘿嘿]", "src": "/emijo/1678782525035.gif" }, { "name": "[对不起]", "src": "/emijo/1678782526027.gif" }, { "name": "[流口水]", "src": "/emijo/1678782835724.gif" }, { "name": "[偷看]", "src": "/emijo/1678782840367.gif" }, { "name": "[迷糊]", "src": "/emijo/1678782850848.gif" }, { "name": "[喝茶]", "src": "/emijo/1678782874536.gif" }, { "name": "[麻了]", "src": "/emijo/12.gif" }, { "name": "[摸脸]", "src": "/emijo/1678782518082.gif" }, { "name": "[再见]", "src": "/emijo/1678782519180.gif" }, { "name": "[委屈]", "src": "/emijo/1678782520179.gif" }, { "name": "[看看]", "src": "/emijo/1678782521178.gif" }, { "name": "[色笑]", "src": "/emijo/1678782522226.gif" }, { "name": "[眨眼]", "src": "/emijo/1678782523134.gif" }, { "name": "[看]", "src": "/emijo/1678782524060.gif" }, { "name": "[拜]", "src": "/emijo/1678782846198.gif" }, { "name": "[嗦舌]", "src": "/emijo/1678782849304.gif" }, { "name": "[生气]", "src": "/emijo/1678782928522.gif" }, { "name": "[抱抱]", "src": "/emijo/1678782878963.gif" }, { "name": "[委屈哭]", "src": "/emijo/1678783006671.gif" }, { "name": "[尬笑]", "src": "/emijo/1678783004041.gif" }, { "name": "[惊讶]", "src": "/emijo/1678782978259.gif" }, { "name": "[略略]", "src": "/emijo/1678782977061.gif" }, { "name": "[亲亲]", "src": "/emijo/1678782975919.gif" }, { "name": "[笑]", "src": "/emijo/1678782974890.gif" }, { "name": "[呜呜]", "src": "/emijo/1678782973710.gif" }, { "name": "[可恶]", "src": "/emijo/1678782972191.gif" }, { "name": "[嘻嘻]", "src": "/emijo/1678782847529.gif" }, { "name": "[委屈哭]", "src": "/emijo/1678782970524.gif" }, { "name": "[想吃]", "src": "/emijo/1678782969077.gif" }, { "name": "[哈喽]", "src": "/emijo/1678782967760.gif" }, { "name": "[比心]", "src": "/emijo/1678782947878.gif" }, { "name": "[闭眼]", "src": "/emijo/1678783105938.gif" }, { "name": "[心心]", "src": "/emijo/1678783095089.gif" }, { "name": "[咀嚼]", "src": "/emijo/1678783093318.gif" }, { "name": "[喜欢]", "src": "/emijo/1678783092296.gif" }, { "name": "[啊]", "src": "/emijo/1678783091356.gif" }, { "name": "[诺]", "src": "/emijo/1678783089505.gif" }, { "name": "[哈]", "src": "/emijo/1678783088558.gif" }, { "name": "[大笑]", "src": "/emijo/1678783086536.gif" }, { "name": "[超喜欢]", "src": "/emijo/1678783053553.gif" }, { "name": "[打call]", "src": "/emijo/1678783050062.gif" }, { "name": "[大哭]", "src": "/emijo/1678783048002.gif" }, { "name": "[吾]", "src": "/emijo/1678783019526.gif" }, { "name": "[打脸]", "src": "/emijo/1678783017265.gif" }, { "name": "[天呐]", "src": "/emijo/1678783015389.gif" }, { "name": "[很气]", "src": "/emijo/1678783010859.gif" }, { "name": "[酷]", "src": "/emijo/E5BE97E6848F.gif" }, { "name": "[满眼]", "src": "/emijo/E5AEB3E7BE9E.gif" }, { "name": "[戳手指]", "src": "/emijo/E5A794E5B188.gif" }, { "name": "[哟西]", "src": "/emijo/E5A4A7E585B5.gif" }, { "name": "[笑一个]", "src": "/emijo/E59D8FE7AC91.gif" }, { "name": "[嘻嘻嘻]", "src": "/emijo/E591B2E78999.gif" }, { "name": "[小笑]", "src": "/emijo/E58FAFE788B1.gif" }, { "name": "[啊这]", "src": "/emijo/E586B7E6B197.gif" }, { "name": "[可爱]", "src": "/emijo/doge.gif" }, { "name": "[打你]", "src": "/emijo/1678811088073.png" }, { "name": "[哟]", "src": "/emijo/1678811086822.png" }, { "name": "[亲一口]", "src": "/emijo/1678811066377.png" }, { "name": "[啊啊啊]", "src": "/emijo/1678783156116.gif" }, { "name": "[赞]", "src": "/emijo/1678811068962.png" }, { "name": "[吃瓜]", "src": "/emijo/1678811073856.png" }, { "name": "[看]", "src": "/emijo/1678811080824.png" }, { "name": "[找死]", "src": "/emijo/1678811081859.png" }, { "name": "[偷笑]", "src": "/emijo/1678811076417.png" }, { "name": "[镇定]", "src": "/emijo/1678811083013.png" }, { "name": "[哦豁]", "src": "/emijo/1678811075042.png" }, { "name": "[期待]", "src": "/emijo/1678811072822.png" }, { "name": "[哎嘿]", "src": "/emijo/1678811084164.png" }, { "name": "[嘻嘿]", "src": "/emijo/1678811085551.png" }, { "name": "[吃一口]", "src": "/emijo/1678811071623.jpg" }, { "name": "[好看]", "src": "/emijo/1678811070270.png" }, { "name": "[666]", "src": "/emijo/1678783155285.gif" }, { "name": "[墨镜]", "src": "/emijo/1678783154282.gif" }, { "name": "[腮红]", "src": "/emijo/1678783152944.gif" }, { "name": "[加油]", "src": "/emijo/1678783151742.gif" }, { "name": "[裂开]", "src": "/emijo/1678783150441.gif" }, { "name": "[棒]", "src": "/emijo/1678783148931.gif" }, { "name": "[送花]", "src": "/emijo/1678783148046.gif" }, { "name": "[疑问]", "src": "/emijo/1678783146823.gif" }, { "name": "[啊]", "src": "/emijo/1678783116720.gif" }, { "name": "[闭眼1]", "src": "/emijo/1678783115285.gif" }, { "name": "[嗯1]", "src": "/emijo/1678783114085.gif" }, { "name": "[为什么]", "src": "/emijo/1678783112719.gif" }, { "name": "[戴口罩]", "src": "/emijo/1678783111251.gif" }, { "name": "[崇拜笑]", "src": "/emijo/1678783109767.gif" }, { "name": "[别这样]", "src": "/emijo/1678783108296.gif" }, { "name": "[流汗]", "src": "/emijo/1678783106847.gif" }, { "name": "[正常]", "src": "/emijo/E5BEAEE7AC91.gif" }, { "name": "[啊呵呵]", "src": "/emijo/E686A8E7AC91.gif" }, { "name": "[你完了]", "src": "/emijo/E998B4E999A9.gif" }, { "name": "[太喜欢]", "src": "/emijo/E889B2.gif" }, { "name": "[好笑]", "src": "/emijo/E7AC91E593AD.gif" }, { "name": "[正经2]", "src": "/emijo/E79CA8E79CBCE79D9B.gif" }, { "name": "[大哭]", "src": "/emijo/E6B581E6B3AA.gif" }, { "name": "[滑稽]", "src": "/emijo/E6969CE79CBCE7AC91.gif" }, { "name": "[没办法]", "src": "/emijo/E697A0E5A588.gif" }, { "name": "[不开心]", "src": "/emijo/E99ABEE8BF87.gif" }, { "name": "[戳]", "src": "/emijo/E9AA9AE689B0.gif" }, { "name": "[大哭2]", "src": "/emijo/re.gif" }]


// 评论主题
const replyThemeClk = () => {
    switch (replyInfo.diaLogType) {
        case 4:
            replyInfo.diaLogType = -1
            textAreaEl.value.focus()
            break;

        case -1:
            replyInfo.diaLogType = 4
            break;

        default:
            replyInfo.diaLogType = 4
            break;
    }
    // if (replyInfo.diaLogType === -1) return
    // return replyInfo.diaLogType = -1
}


/**
 * 清空回复信息
 */
const closeReplyComment = () => {
    bigReplyCfg.showReply = false
    replyInfo.placehodel = '评个小论吧！'
    replyInfo.replyData = {}
}

export {
    likeImgClk,
    textAreaEl, commentBoxEl,
    clearImg, replyInfo, commentOnIn,
    pasteEv, fileImg, fileImgUpdata,
    replyInput, replyBarClk, emjioList, emjioListClk,
    replyClick, replyAn, renderAtList, sendMsg, xuNiReplyClk, atClk,
    xuNiTextareaEl, copy, replyThemeClk, bigReplyCfg, bigInputFocusAndBlur, textAreaFoucusEnd, closeReplyComment,
}