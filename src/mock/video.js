// 使用 Mock
import Mock from 'mockjs'
import './extend.js'
// console.log(
//     Mock.mock({
//         'music|10': [
//             {
//                 img: '@myimg',
//                 avatar: '@myimg',
//                 'author|1-5': '@cname',//作者 
//                 title: '@ctitle(5,100)',//标题  
//                 listen: '@integer(0,10000)',//听歌次数
//                 'musicTime': '@time(HH:mm)',//歌曲时长 
//                 'musicSrc':'@music',//歌曲地址
//                 'id': '@id',
//             }
//         ]
//     })
// );



const emjioLists = ['[嘿嘿]', '[对不起]', '[流口水]', '[偷看]', '[迷糊]', '[喝茶]', '[麻了]', '[摸脸]', '[再见]', '[委屈]', '[看看]', '[色笑]', '[眨眼]', '[看]', '[拜]', '[嗦舌]', '[生气]', '[抱抱]', '[委屈哭]', '[尬笑]', '[惊讶]', '[略略]', '[亲亲]', '[笑]', '[呜呜]', '[可恶]', '[嘻嘻]', '[委屈哭]', '[想吃]', '[哈喽]', '[比心]', '[闭眼]', '[心心]', '[咀嚼]', '[喜欢]', '[啊]', '[诺]', '[哈]', '[大笑]', '[超喜欢]', '[打call]', '[大哭]', '[吾]', '[打脸]', '[天呐]', '[很气]', '[酷]', '[满眼]', '[戳手指]', '[哟西]', '[笑一个]', '[嘻嘻嘻]', '[小笑]', '[啊这]', '[可爱]', '[打你]', '[哟]', '[亲一口]', '[啊啊啊]', '[赞]', '[吃瓜]', '[看]', '[找死]', '[偷笑]', '[镇定]', '[哦豁]', '[期待]', '[哎嘿]', '[嘻嘿]', '[吃一口]', '[好看]', '[666]', '[墨镜]', '[腮红]', '[加油]', '[裂开]', '[棒]', '[送花]', '[疑问]', '[啊]', '[闭眼1]', '[嗯1]', '[为什么]', '[戴口罩]', '[崇拜笑]', '[别这样]', '[流汗]', '[正常]', '[啊呵呵]', '[你完了]', '[太喜欢]', '[好笑]', '[正经2]', '[大哭]', '[滑稽]', '[没办法]', '[不开心]', '[戳]', '[大哭2]',]

const theme = ['macDark', 'macLight']

/**
 * 获取子评论
 * @param {Object} getInfo 
 * @return Array 返回一个数组
 */
const getChildComment = getInfo => {
    // const finish = Mock.Random.boolean()
    // if (finish) return 'finish'

    const { id } = Mock.mock({
        'id|1-5': ['@id'],
    })

    const childId = id

    const childComment = []
    childId.some((it2, i) => {
        const atArr = Mock.mock({
            'at|0-5': ['@id']
        })
        const at = []
        atArr.at.forEach(it => {
            const nm = Mock.mock('@cname')
            const obj = {
                uid: it,
                uName: `@${nm}(${it})`,
            }

            at.push(obj)
        });

        // 子级级评论 
        const { msg } = Mock.mock({
            msg: {
                at,
                // 评论的文本'@cparagraph'
                'txt': function () {
                    let t = Mock.mock('@cparagraph(0,7)')

                    if (this.at.length) {
                        this.at.some(it => {
                            const { uName, uid } = it
                            const nm = uName.replace(`(${uid})`, '')
                            t += `${nm}(${uid})`
                        });
                    }
                    return t + Mock.Random.pick(emjioLists)
                },
                // 评论的图dataImage 
                'img|0-1': '@myimg'
            }
        })


        const childObj = {
            'commentTheme': Mock.Random.boolean() ? Mock.Random.pick(theme) : '',
            childId: it2,
            up: Mock.Random.natural(0, 1000),
            IP: Mock.Random.county(),
            date: Mock.Random.date('T'),
            uId: Mock.Random.id(),
            isUp: Mock.Random.boolean(),//已赞过
            isDel: Mock.Random.bool(1, 9, true),
        }
        // 子级发布者信息
        const childUserInfo = {
            "uName": Mock.Random.cname(),//昵称
            "avatar": Mock.mock('@myimg'),//用户头像
            "sex": Mock.Random.pick([0, 1]),//性别 
            // 认证徽章
            'authIcon': Mock.Random.boolean() ? '' : (`<svg
        t="1709780406929"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4742"
        width="200"
        height="200"
      >
        <path
          d="M855.458909 138.379636a622.312727 622.312727 0 0 1-197.818182-48.546909c-37.608727-16.989091-95.883636-55.854545-129.861818-80.058182a51.153455 51.153455 0 0 0-58.274909 0c-33.978182 24.203636-92.206545 63.069091-131.072 80.058182a622.312727 622.312727 0 0 1-197.818182 48.546909C113.943273 139.589818 93.277091 162.629818 93.277091 189.346909v305.803636a456.657455 456.657455 0 0 0 214.807273 387.165091l94.673454 59.485091 67.956364 42.496a52.596364 52.596364 0 0 0 53.434182 0l67.956363-42.496 94.673455-59.485091a456.657455 456.657455 0 0 0 214.807273-387.118545V188.136727a47.662545 47.662545 0 0 0-46.126546-49.757091z"
          fill="#45BE89"
          p-id="4743"
        ></path>
        <path
          d="M498.641455 638.370909a34.909091 34.909091 0 0 1-25.460364 10.938182h-3.677091a38.306909 38.306909 0 0 1-26.670545-15.778909l-134.749091-133.492364c-10.891636-12.101818-15.732364-36.398545 1.256727-53.387636 15.778909-14.568727 40.029091-12.148364 58.228364 6.050909l111.662545 103.144727 200.238545-200.238545a37.794909 37.794909 0 0 1 52.177455 1.210182c10.938182 14.568727 10.938182 37.655273-2.420364 50.967272l-230.586181 230.586182z"
          fill="#FFFFFF"
          p-id="4744"
        ></path>
      </svg>`),
            "title": Mock.Random.boolean() ? '' : ({ label: Mock.Random.cname(), labelColor: Mock.Random.color(), bgColor: Mock.Random.color(), }),//称号
        }
        // 回复的的评论
        const replyCommentId = Mock.Random.boolean() ? '' : Mock.Random.pick(childId)

        childObj.msg = msg
        childObj.userInfo = childUserInfo
        childObj.replyCommentId = replyCommentId

        childComment.push(childObj)
    });
    return replyCommentMsg(childComment)
}



/**
 * # 根据url获取query参数
 * @param {Url} urlStr get请求获取参数 eg:"/video/childcomments?sort=1&start=2&count=5&childCount=14&commenIndex=0"
 * @returns Object
 */
const getQuery = urlStr => {
    const startIndex = urlStr.indexOf('?');
    const strSub = urlStr.substring(startIndex + 1);
    const strReplace = strSub.replaceAll('=', '":');
    const arr = strReplace.split('&');

    arr.forEach((it, i) => arr[i] = '"' + it);
    const arrToStr = arr.join(',')
    const resStr = `{${arrToStr} }`

    const resObj = JSON.parse(resStr);

    return resObj
}
// 回复的的评论 
const replyCommentMsg = commentArr => {
    if (!commentArr.length) return commentArr

    // 回复的评论信息  
    commentArr.forEach(it => {
        const isRep = Mock.mock('@boolean'),
            isDel = Mock.mock('@boolean');

        if (!isRep) return
        it.replyCommentMsg = {}

        const replyCommentMsg = {
            uName: it.userInfo.uName,
            msg: isDel ? "" : it.msg,
            uid: 'test',
            isDel
        }
        it.replyCommentMsg = replyCommentMsg
    });

    return commentArr
}


const loadCommett = () => {
    // 修改 0 与 6
    const parentId = Mock.mock({
        'id|1-5': ['@id']
        // 'id|2': ['@id']
    })

    const parIdArr = parentId.id

    if (!parIdArr) return []
    const arr = []
    let child = null

    // 生成子级id数组
    parIdArr.forEach(it => {
        // 子评论总数 
        child = Mock.mock({
            'id|0-5': ['@id'],
            'at|0-5': ['@id'],
        })


        // 父级评论
        const parentObj = {
            childCount: child.id.length,
            parentId: Mock.Random.id(),
            up: Mock.Random.natural(0, 1000),
            IP: Mock.Random.county(),
            date: Mock.Random.date('T'),
            uId: Mock.Random.id(),
            isUp: Mock.Random.boolean(),//已赞过 
            'commentTheme': Mock.Random.boolean() ? Mock.Random.pick(theme) : '',
        }
        // 父级发布者信息
        const parentUserInfo = {
            "uName": Mock.Random.cname(),//昵称
            "avatar": Mock.mock('@myimg'),//用户头像
            "sex": Mock.Random.pick([0, 1]),//性别 
            // 认证徽章
            'authIcon': Mock.Random.boolean() ? '' : (`<svg
        t="1709780406929"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4742"
        width="200"
        height="200"
      >
        <path
          d="M855.458909 138.379636a622.312727 622.312727 0 0 1-197.818182-48.546909c-37.608727-16.989091-95.883636-55.854545-129.861818-80.058182a51.153455 51.153455 0 0 0-58.274909 0c-33.978182 24.203636-92.206545 63.069091-131.072 80.058182a622.312727 622.312727 0 0 1-197.818182 48.546909C113.943273 139.589818 93.277091 162.629818 93.277091 189.346909v305.803636a456.657455 456.657455 0 0 0 214.807273 387.165091l94.673454 59.485091 67.956364 42.496a52.596364 52.596364 0 0 0 53.434182 0l67.956363-42.496 94.673455-59.485091a456.657455 456.657455 0 0 0 214.807273-387.118545V188.136727a47.662545 47.662545 0 0 0-46.126546-49.757091z"
          fill="#45BE89"
          p-id="4743"
        ></path>
        <path
          d="M498.641455 638.370909a34.909091 34.909091 0 0 1-25.460364 10.938182h-3.677091a38.306909 38.306909 0 0 1-26.670545-15.778909l-134.749091-133.492364c-10.891636-12.101818-15.732364-36.398545 1.256727-53.387636 15.778909-14.568727 40.029091-12.148364 58.228364 6.050909l111.662545 103.144727 200.238545-200.238545a37.794909 37.794909 0 0 1 52.177455 1.210182c10.938182 14.568727 10.938182 37.655273-2.420364 50.967272l-230.586181 230.586182z"
          fill="#FFFFFF"
          p-id="4744"
        ></path>
      </svg>`),
            "title": Mock.Random.boolean() ? '' : ({ label: Mock.Random.cname(), labelColor: Mock.Random.color(), bgColor: Mock.Random.color(), }),//称号
        }

        const at = []
        child.at.forEach(it => {
            const nm = Mock.mock('@cname')
            const obj = {
                uid: it,
                uName: `@${nm}(${it})`,
            }

            at.push(obj)
        });

        // 评论 
        const { msg } = Mock.mock({
            msg: {
                at,
                // 评论的文本'@cparagraph'
                'txt': function () {
                    let t = Mock.mock('@cparagraph(0,7)')

                    if (this.at.length) {
                        this.at.some(it => {
                            const { uName, uid } = it
                            const nm = uName.replace(`(${uid})`, '')
                            t += `${nm}(${uid})`
                        });
                    }
                    return t + Mock.Random.pick(emjioLists)
                },
                // 评论的图dataImage 
                'img|0-1': '@myimg'
            }
        })

        parentObj.userInfo = parentUserInfo
        parentObj.msg = msg

        // 生成子级数量  

        const { id: childId } = child

        if (!childId.length) return arr.push(parentObj)

        const childComment = []
        childId.some((it2, i) => {
            // 大于2条评论不在继续获取数据
            if (i > 1) return true

            const atArr = Mock.mock({
                'at|0-5': ['@id']
            })
            const at = []
            atArr.at.forEach(it => {
                const nm = Mock.mock('@cname')
                const obj = {
                    uid: it,
                    uName: `@${nm}(${it})`,
                }

                at.push(obj)
            });

            // 子级级评论 
            const { msg } = Mock.mock({
                msg: {
                    at,
                    // 评论的文本'@cparagraph'
                    'txt': function () {
                        let t = Mock.mock('@cparagraph(0,7)')

                        if (this.at.length) {
                            this.at.some(it => {
                                const { uName, uid } = it
                                const nm = uName.replace(`(${uid})`, '')
                                t += `${nm}(${uid})`
                            });
                        }
                        return t + Mock.Random.pick(emjioLists)
                    },
                    // 评论的图dataImage 
                    'img|0-1': '@myimg'
                }
            })

            const childObj = {
                'commentTheme': Mock.Random.boolean() ? Mock.Random.pick(theme) : '',
                childId: it2,
                up: Mock.Random.natural(0, 1000),
                IP: Mock.Random.county(),
                date: Mock.Random.date('T'),
                uId: Mock.Random.id(),
                isUp: Mock.Random.boolean(),//已赞过
                isDel: Mock.Random.bool(1, 9, true),
            }
            // 子级发布者信息
            const childUserInfo = {
                "uName": Mock.Random.cname(),//昵称
                "avatar": Mock.mock('@myimg'),//用户头像
                "sex": Mock.Random.pick([0, 1]),//性别 
                // 认证徽章
                'authIcon': Mock.Random.boolean() ? '' : (`<svg
        t="1709780406929"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4742"
        width="200"
        height="200"
      >
        <path
          d="M855.458909 138.379636a622.312727 622.312727 0 0 1-197.818182-48.546909c-37.608727-16.989091-95.883636-55.854545-129.861818-80.058182a51.153455 51.153455 0 0 0-58.274909 0c-33.978182 24.203636-92.206545 63.069091-131.072 80.058182a622.312727 622.312727 0 0 1-197.818182 48.546909C113.943273 139.589818 93.277091 162.629818 93.277091 189.346909v305.803636a456.657455 456.657455 0 0 0 214.807273 387.165091l94.673454 59.485091 67.956364 42.496a52.596364 52.596364 0 0 0 53.434182 0l67.956363-42.496 94.673455-59.485091a456.657455 456.657455 0 0 0 214.807273-387.118545V188.136727a47.662545 47.662545 0 0 0-46.126546-49.757091z"
          fill="#45BE89"
          p-id="4743"
        ></path>
        <path
          d="M498.641455 638.370909a34.909091 34.909091 0 0 1-25.460364 10.938182h-3.677091a38.306909 38.306909 0 0 1-26.670545-15.778909l-134.749091-133.492364c-10.891636-12.101818-15.732364-36.398545 1.256727-53.387636 15.778909-14.568727 40.029091-12.148364 58.228364 6.050909l111.662545 103.144727 200.238545-200.238545a37.794909 37.794909 0 0 1 52.177455 1.210182c10.938182 14.568727 10.938182 37.655273-2.420364 50.967272l-230.586181 230.586182z"
          fill="#FFFFFF"
          p-id="4744"
        ></path>
      </svg>`),
                "title": Mock.Random.boolean() ? '' : ({ label: Mock.Random.cname(), labelColor: Mock.Random.color(), bgColor: Mock.Random.color(), }),//称号
            }

            childObj.msg = msg
            childObj.userInfo = childUserInfo

            childComment.push(childObj)
        });
        parentObj.child = replyCommentMsg(childComment)

        arr.push(parentObj)
    });

    return arr
}
/**
 * 生成评论
 */
const comment = getInfo => {
    const { url } = getInfo
    const get = getQuery(url)
    const { t } = get

    switch (t) {
        // 加载评论
        case 0:
            return loadCommett()

        // 加载子评论
        case 1:
            return getChildComment(get)

        // 删除评论 |0 删除失败 |  1 删除成功 |　-1 无权操作
        // Mock.Random.pick([0, -1, 1])
        case 2:
            // return Mock.Random.pick([0, -1, 1])
            return 1
    }
}

// console.log(createData());

// console.log(Mock.Random.natural(0, emjioLists.length));

// console.log(JSON.stringify(Mock.mock(video)));
// console.log(JSON.stringify(createData())); 

export default comment