import axios from "axios";
import { debounce } from "quasar";
import { ref, nextTick } from "vue";
import formatDates from "../utils/formateDate.js";
import commentAtAndEmjio from "../utils/commentAtAndEmjio.js";
import { replyInfo } from "./reply.js";

const scroll = ref(0);
const comments = ref([]);

/**
 * 评论回复事件
 * - 回复子级：parentData, childData 都有数据
 * - 回复父级：只有parentData数据, childData为null
 * @param {Object} parentData 父级评论数据
 * @param {Object} childData 子级评论数据
 */
const commentReplyEv = (parentData, childData) => {
    const parentCommentIndex = comments.value.findIndex(it => it.parentId === parentData.parentId),
        parentInfo = comments.value[parentCommentIndex]
    replyInfo.replyData.parent = parentInfo

    // 回复父级
    if (!childData) return

    // 回复子级 
    let childCommentIndex = 0
    if (parentInfo.child.length) childCommentIndex = parentInfo.child.findIndex(it => it.childId === childData.childId)

    const childCommentInfo = parentInfo.child[childCommentIndex]
    replyInfo.replyData.child = childCommentInfo
}

/**
 * # 加载更多子评论
 * @param {Object} loadInfo 加载评论的信息
 */
const loadChildComments = async (loadInfo) => {
    const { childCount, start, parentId } = loadInfo;
    const findParentIndex = comments.value.findIndex(it => it.parentId === parentId)

    comments.value[findParentIndex].openCommentLoading = 1;

    const { data } = await axios("/api/comments", {
        params: loadInfo,
    });

    // 没有更多子评论了
    if (data === 'finish') return comments.value[findParentIndex].openCommentLoading = -1

    const cominit = childCommentInit(data)

    const child = comments.value[findParentIndex].child
    child.splice(child.length, 0, ...cominit);

    comments.value[findParentIndex].openCommentLoading = 0

    await nextTick();
    document.querySelector('.scroll').scrollTo(0, scroll.value)
};

const scrolled = debounce(pos => scroll.value = pos, 200)

/**
 * @param {Object} comments object|array 子级评论 | 父子级评论
 * @returns Object 返回处理的数据
 * # 评论组件逻辑代码
 * 1. 加载每条父子评论数据 
 * 2. 加载子级评论
 * 
 * # 处理渲染格式
 * 1. 处理时间格式
 * 2. 处理at成员
 * 3. 处理评论视频点播
 * 4. 处理展开子评论按钮状态
 */
const commentInit = comments => {
    const isArr = Array.isArray(comments)
    /**
    * 数组 - 处理子级评论
    */
    if (isArr) return childCommentInit(comments)

    /**
    * - 处理父级评论at与表情;
    * - 对象 | 处理父级评论
    */

    const { child, childCount, date, msg } = comments,
        { at, txt, } = msg;

    const commetnTxt = commentAtAndEmjio(at, txt);
    comments.msg.txt = commetnTxt;

    // 展开评论按钮状态
    const childLen = child ? child.length : 0;
    const statu = childLen === 0 || childLen >= childCount ? -1 : 0;
    comments.openCommentLoading = statu

    // 格式化时间
    comments.date = formatDates(date);

    // 没有子评论直接返回
    if (!childCount) return comments

    // 有子评论
    const childInit = childCommentInit(child)
    comments.child = childInit

    return comments
}

/**
 * # 处理子评论
 * @param {Array} commentArr 处理的子评论
 * @returns Array 返回已处理的子评论
 */
const childCommentInit = commentArr => {
    // 遍历子级
    commentArr.forEach(comment => {
        // 回复的评论
        const { replyCommentMsg, msg, commentTheme, isDel, date } = comment,
            { txt, at } = msg;

        // 如果评论被删除过，结束回调
        if (isDel) return


        // 处理时间
        comment.date = formatDates(date);

        // 处理子主题
        if (commentTheme) {
            switch (commentTheme) {
                case "macDark":
                    comment.theme = "mac-dark";
                    break;

                case "macLight":
                    comment.theme = "mac-light";
                    break;
                default:
                    comment.theme = "";
                    break;
            }
        }

        // 处理评论at与表情;
        const commetnTxt = commentAtAndEmjio(at, txt);
        comment.msg.txt = commetnTxt;
        // 处理回复的某人的评论 
        if (replyCommentMsg) {
            const { msg: replyMsg, isDel: replyCommentIsDel } = replyCommentMsg
            let replyCommetnTxt = '该评论已被删除'
            if (!replyCommentIsDel) replyCommetnTxt = commentAtAndEmjio(replyMsg.at, replyMsg.txt);
            comment.replyCommentMsg.msg = { txt: replyCommetnTxt }
        }
    });

    return commentArr
}

/**
 * # 处理评论 
 * @param {Array}  comment 加载的评论  
 */
const loadComments = commentArr => {
    // 展开按钮状态
    commentArr.forEach(it => {
        it = commentInit(it)
    });
    comments.value.splice(comments.value.length, 0, ...commentArr);
};

/** 
 * @param {Array} comment 要删除的评论数组
 * @param {String} parentId 删除的父级评论id
 * @param {String} childId 要删除的评论id  
 */
const delComment = (parentId, childId) => {
    // 父级下标
    const findParentCommentIndex = comments.value.findIndex(it => it.parentId === parentId)

    if (!childId) {
        comments.value.splice(findParentCommentIndex, 1)
        return comments.value.childCount--
    }


    // 删除子级 
    const child = comments.value[findParentCommentIndex].child;
    const findChildCommetIndex = child.findIndex(it => it.childId === childId)
    child.splice(findChildCommetIndex, 1)
    return comments.value.childCount--
};

export {
    comments,
    loadChildComments,
    loadComments, scrolled, delComment
    , commentReplyEv
}