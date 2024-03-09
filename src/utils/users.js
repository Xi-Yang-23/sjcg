import { reactive } from "vue";
import useUserInfoStore from "../stores/userInfo";

const U = useUserInfoStore()

const user = reactive(
    {
        // 0 背景 | 1 头像 | 2 昵称 + 性别 | 3  简介
        cltType: 0,
        dialogModel: false,
        url: '',//图片裁剪路径
        aspectRatio: 1 / 1,//裁剪比例 
        fileModel: null,//选取的图片
        uploading: false,
        clipImgData: '',//裁剪的图片base64数据
        upTitle: '昵称、性别',
        describe: U.describe,//简介
        userName: U.userName,//昵称
        sex: U.sex,//性别
    }
)

/**
 * 用户点击事件
 * @param {Number} t 用户点击类型   0 背景 | 1 头像 | 2 昵称 + 性别 | 3  简介
 */
const userClk = (t) => {
    user.dialogModel = true
    user.cltType = t

    const userInfoStore = useUserInfoStore()

    switch (t) {
        // 背景点击
        case 0:
            user.url = userInfoStore.bg
            user.aspectRatio = 4 / 3
            break;

        // 头像点击
        case 1:
            user.url = userInfoStore.avatar
            user.aspectRatio = 1 / 1
            break;

        // 昵称点击 
        case 2:
            user.upTitle = '修改昵称、性别'
            break;

        // 昵称点击 
        case 3:
            user.upTitle = '修改简介'
            break;
    }
}

/**
 * 裁剪的图片
 */
const clipImg = (imgData) => {
    user.clipImgData = imgData
}


/**
 * 模态框关闭
 */
const dialogHide = () => {
    // 回复初始化
    user.fileModel = null
    user.clipImgData = ''
}



/**
 * 更新用户名、性别或简介| 更新背景、头像 
 */
const upSexOrDescribeOrAvatarOrBg = () => {
    console.log('更新');
}


/**
 * 选取图片
 * @param {File} v 选取图片的file 
 */
const upFile = (v) => {
    if (!v) return

    var fr = new FileReader();
    const windowURL = window.URL || window.webkitURL,
        blob = windowURL.createObjectURL(user.fileModel);

    user.url = blob
}

/**
 * 清除图片
 */
const clearFile = () => {
    user.fileModel = null
    const userInfoStore = useUserInfoStore()
    switch (user.cltType) {
        case 0:
            user.url = userInfoStore.bg
            break;

        case 1:
            user.url = userInfoStore.avatar
            break;
    }
}

export {
    user,
    userClk,
    upFile,
    clearFile,
    dialogHide,
    clipImg,
    upSexOrDescribeOrAvatarOrBg
}