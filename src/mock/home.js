// 使用 Mock
import Mock from 'mockjs'
import comment from './video'
import './extend.js'
import { startData } from './user.js'


Mock.setup({
    timeout: '100-2000'
})



const qdData = (firstRun) => {
    if (!firstRun) {
        const stop = Mock.mock('@boolean')
        // const stop = false

        // 结束
        if (stop) {
            return {
                finish: true,
            }
        }
    }

    const lists = Mock.mock({
        'lists|10': [
            {
                img: '@myimg',
                'uName|1-5': '@cname',//用户名
                title: '@ctitle(5,100)',//标题
                content: '@cparagraph',//简介
                see: '@integer(0,10000)',//浏览 
                likes: '@integer(0,10000)',//点赞
                'avatar': '@myimg',//作者头像
                date: '@date(T)',//时间戳
            }
        ]
    })


    return {
        lists: lists.lists,
        finish: false
    }
}



// 首页推荐数据
const homeTuiJian = Mock.mock({
    'lists|3': [
        // 视频
        {
            'src': '@myimg',//视频封面
            'avatar': '@myimg',//作者头像
            'type': 0,//类型 0视频 | 1贴子 | 2音乐
            'author|1-5': '@cname',//用户名
            'videoTime': '@date(hh:MM)',//发布日期
            'subDate': '@date(yyyy/MM/dd)',//发布日期
            'tags|0-5': ['@cword(1,6)'],//标签
            gf: '@boolean',//官方
            see: '@integer(0,10000)',//浏览
            commons: '@integer(0,10000)',//评论
            likes: '@integer(0,10000)',//点赞
            title: '@ctitle(5,100)',//标题
            content: '@cparagraph',//简介
        },

        // 贴子
        {
            'tags|0-5': ['@cword(1,6)'],//标签
            'srcs|0-10': ['@myimg'],// 封面
            'avatar': '@myimg',//作者头像
            'type': 1,//类型 0视频 | 1贴子 | 2音乐
            'author|1-5': '@cname',//用户名
            'subDate': '@date(yyyy/MM/dd)',//发布日期
            gf: '@boolean',//官方
            see: '@integer(0,10000)',//浏览
            commons: '@integer(0,10000)',//评论
            likes: '@integer(0,10000)',//点赞
            title: '@ctitle(5,100)',//标题
            content: '@cparagraph',//简介
        },

        // 音乐
        {
            'tags|0-5': ['@cword(1,6)'],//标签
            img: '@myimg',// 封面
            'avatar': '@myimg',//作者头像
            'type': 2,//类型 0视频 | 1贴子 | 2音乐
            'author|1-8': '@cname',//作者
            'musicTime': '@time(HH:mm)',//歌曲时长
            'subDate': '@date(yyyy/MM/dd)',//发布日期
            gf: '@boolean',//官方 
            commons: '@integer(0,10000)',//评论
            listen: '@integer(0,10000)',//听歌次数
            title: '@ctitle(1,30)',//标题
            content: '@cparagraph',//简介 
            'musicSrc': '@music',//歌曲地址
            'id': '@id',
        },
    ],
})



/** 首页推荐数据  
 *  首页滚动加载数据
 * @returns {Array}
 */
const getHomeScrollData = () => {
    // const stop = Mock.mock('@boolean')
    const stop = false

    // 结束
    if (stop) {
        return {
            finish: true,
        }
    }

    const getDta = Mock.mock({
        'lists|3': [
            // 视频
            {
                'tags|0-5': ['@cword(1,6)'],//标签
                'src': '@myimg',//视频封面
                'avatar': '@myimg',//作者头像
                'type': 0,//类型 0视频 | 1贴子 | 2音乐
                'author|1-5': '@cname',//用户名
                'videoTime': '@time(HH:mm)',//歌曲时长
                'subDate': '@date(yyyy/MM/dd)',//发布日期
                gf: '@boolean',//官方
                see: '@integer(0,10000)',//浏览
                commons: '@integer(0,10000)',//评论
                likes: '@integer(0,10000)',//点赞
                title: '@ctitle(5,100)',//标题
                content: '@cparagraph',//简介
            },

            // 贴子
            {
                'tags|0-5': ['@cword(1,6)'],//标签
                'srcs|0-10': ['@myimg'],// 封面
                'type': 1,//类型 0视频 | 1贴子 | 2音乐
                'avatar': '@myimg',//作者头像
                'author|1-5': '@cname',//用户名
                'subDate': '@date(yyyy/MM/dd)',//发布日期
                gf: '@boolean',//官方
                see: '@integer(0,10000)',//浏览
                commons: '@integer(0,10000)',//评论
                likes: '@integer(0,10000)',//点赞
                title: '@ctitle(5,100)',//标题
                content: '@cparagraph',//简介
            },

            // 音乐
            {
                'tags|0-5': ['@cword(1,6)'],//标签
                img: '@myimg',// 封面
                'avatar': '@myimg',//作者头像
                'type': 2,//类型 0视频 | 1贴子 | 2音乐
                'author|1-8': '@cname',//作者
                'musicTime': '@time(HH:mm)',//歌曲时长
                'subDate': '@date(yyyy/MM/dd)',//发布日期
                gf: '@boolean',//官方 
                commons: '@integer(0,10000)',//评论
                listen: '@integer(0,10000)',//听歌次数
                title: '@ctitle(1,30)',//标题
                content: '@cparagraph',//简介 
                'musicSrc': '@music',//歌曲地址
                'id': '@id',
            },
        ]
    })

    return {
        lists: Mock.Random.shuffle(getDta.lists),
        finish: false
    }
}

// 首页 
// Mock.mock('/home/scroll/data', getHomeScrollData)

Mock.mock('/home', getHomeScrollData)

// 前端
Mock.mock('/home/qd', qdData)


// 音乐
Mock.mock('/home/music', (firstRun) => {
    if (!firstRun) {
        const stop = Mock.mock('@boolean')
        // const stop = false

        // 结束
        if (stop) {
            return {
                finish: true,
            }
        }
    }

    const lists = Mock.mock({
        'lists|10': [
            {
                img: '@myimg',
                avatar: '@myimg',
                'author|1-5': '@cname',//作者 
                title: '@ctitle(5,100)',//标题  
                listen: '@integer(0,10000)',//听歌次数
                'musicTime': '@time(HH:mm)',//歌曲时长 
                'musicSrc': '@music',//歌曲地址
                'id': '@id',
            }
        ]
    })


    return {
        lists: lists.lists,
        finish: false
    }
})


// 轮播
Mock.mock('/lunbo', {
    'carousel|1-6': [
        {
            'src': "@myimg",
            'caption': "@cparagraph",
            'hasTitle': '@boolean'
        }
    ],
})

//  评论
// Mock.mock('/video/comments', video)
// 获取子评论
/**
 * @param {Number}  t 0 | 父评论 | 1 获取子评论 | 2 删除评论 
 * @param {Number}  page 第几页
 * @param {Number}  count 获取几条
 */
Mock.mock(/\/api\/comments.*?/, comment)


/**
 * !个人主页
 */
// 收藏
Mock.mock(/\/api\/users.*?/, startData) 