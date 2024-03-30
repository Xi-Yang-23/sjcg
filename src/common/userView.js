import { reactive } from "vue"
import { Dialog, Notify } from "quasar";
import gloabStore from "../stores/gloabStore";
const useGloabStore = gloabStore();

/**
 * 视频相关信息
 */
const videoInfo = reactive(
    {
        gxList: [1, 2, 3, 4],
        showDialog: false,//弹窗
        diaFullWidth: false,
        showVideo: true, //悬浮视频
        sort: false,//排序方式 　｜　true 时间排序　｜ false 按热度排序   
        videoTitle: '',//视频标题
        videoContent: '',//视频内容
        dialogPos: 'bottom',
        dialogwHide: 'slide-down',
        dialogShow: 'slide-up',
        dialogType: 'videoEdit',//对话框类型  | videoEdit 视频内容编辑 | showGx 贡献赠送成员显示
    }
)

/**
 * @statu  0 未关注 add  |1 已关注 check | 2 已互关 done_all
 * @icon  未关注 add  | 已关注 check |  已互关 done_all
 * @label  未关注   | 已关注  |  已互关 
 * @loading  true 加载状态 | false 非加载状态
 */
const huGuang = reactive({
    statu: 0,
    icon: 'add',
    label: '关注',
    loading: false
})

/**
 * 关注按钮
 */
const guanZhu = () => {
    const { statu } = huGuang

    switch (statu) {
        // 未关注
        case 0:
            huGuang.loading = true;
            setTimeout(() => {
                huGuang.statu = 1
                huGuang.label = '已关注'
                huGuang.icon = 'check'
                huGuang.loading = false;
                Notify.create({
                    message: '已关注', position: 'top',
                    type: 'info',
                    icon: 'check',
                    progress: true,
                })
            }, 1500);
            break;

        // 已关注
        case 1:
            huGuang.loading = true;
            setTimeout(() => {
                huGuang.statu = 2
                huGuang.label = '已互关'
                huGuang.icon = 'done_all'
                huGuang.loading = false;

                Notify.create({
                    message: '已互关', position: 'top',
                    type: 'info',
                    progress: true,
                    icon: 'done_all',
                })
            }, 1500);
            break;

        // 已互关
        default:
            // 取关操作
            Dialog.create({
                transitionHide: 'slide-left',
                transitionShow: 'slide-left',
                title: "你要取消关注吗?",
                cancel: {
                    label: '是的',
                    unelevated: true,
                    flat: true,
                },
                ok: {
                    label: '手滑',
                    unelevated: true
                },
                focus: "ok",
            }).onCancel(() => {
                huGuang.loading = true;
                setTimeout(() => {
                    huGuang.statu = 0
                    huGuang.label = '关注'
                    huGuang.icon = 'add'
                    huGuang.loading = false;

                    Notify.create({
                        message: '已取关', position: 'top',
                        type: 'info',
                        progress: true,
                        icon: 'close',
                    })
                }, 1500);
            });
            break;
    }
}

/**
 * 收藏按钮
 */
const starCik = () => {

}


/**
 * 打开赠送贡献值按钮
 */
const giveGonXian = () => {
    useGloabStore.toggleGiveGxianDialog()


    // Dialog.create({
    //     message: '选择贡献值数量',
    //     options: {
    //         type: 'radio',
    //         model: '1',
    //         inline: true,

    //         items: [
    //             { color: 'blue', label: '1', value: '1', checkedIcon: 'task_alt', keepColor: true },
    //             { color: 'blue', label: '3', value: '3', checkedIcon: 'task_alt', keepColor: true },
    //             { color: 'blue', label: '5', value: '5', checkedIcon: 'task_alt', keepColor: true },
    //             { color: 'red', disable: true, label: '1', value: 'admin', checkedIcon: 'task_alt', keepColor: true }
    //         ]
    //     },
    // }).onOk(data => {
    //     console.log('>>>> OK, received', data)
    // })
}



/**
 * 提交编辑的视频
 */
const editVideoSub = (videoInfo) => {
    // console.log('视频编辑');  
}


// 评论排序
const commentSort = val => {
    console.log('评论排序');
};

/**
 * 锁定\解锁视频
 */
const clockOrLockVideo = () => {
    console.log('锁定\解锁视频');

}

/**
 * 对话框
 * @param {String}   t videoEdit 编辑视频 | showGx 贡献值成员显示
 */
const openDialog = t => {
    if (t === 'videoEdit') {
        videoInfo.dialogPos = 'standard'
        videoInfo.dialogwHide = 'slide-left'
        videoInfo.dialogShow = 'slide-left'
    } else {
        videoInfo.dialogPos = 'bottom'
        videoInfo.dialogwHide = 'slide-down'
        videoInfo.dialogShow = 'slide-up'
    }
    videoInfo.dialogType = t
    videoInfo.showDialog = true
}



/**
 * 贡献值列表
 */
const loadGiveGxList = (index, done) => {
    const arr = [1, 2, 3, 5]
    setTimeout(() => {
        videoInfo.gxList.splice(videoInfo.gxList.length, 0, ...arr)
        done()
    }, 1000);
}



/**
 * 删除视频
 */
const delVideo = () => {
    Dialog.create({
        title: '确定删除该视频吗？',
        cancel: {
            flat: false,
            unelevated: true,
            label: "手滑",
        },
        ok: {
            flat: true,
            unelevated: true,
            label: "确定",
        },
        color: "primary",
        focus: 'cancel',
        transitionShow: "slide-left",
        transitionHide: "slide-left",
    }).onOk(() => {
        console.log('删除');
    })

}
export {
    videoInfo,
    guanZhu, starCik,
    giveGonXian, commentSort, editVideoSub,
    clockOrLockVideo,
    delVideo, openDialog, loadGiveGxList,

    huGuang
}
