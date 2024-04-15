import mock from "mockjs";
import './extend.js'

/**
 * 收藏
 */
const startData = mock.mock({
    // 'muisc|0-5': [
    //     // 音乐收藏
    //     {
    //         'tags|0-5': ['@cword(1,6)'],//标签
    //         img: '@myimg',// 封面
    //         'crateAuthor|1-8': '@cname',//创作者
    //         'createDate': '@date(yyyy/MM/dd)',//创建日期 
    //         'commons|0-10': ['@id'],//评论 
    //         title: '@ctitle(1,30)',//标题
    //         'id': '@id',
    //         'stars|0-20': ['@id'],//被收藏的id
    //     },
    // ],

    // 收藏内容
    'artilce|0-5': [
        {
            'tags|0-5': ['@cword(1,6)'],//标签
            img: '@myimg',// 封面
            'crateAuthor|1-8': '@cname',//创作者
            'createDate': '@date(yyyy/MM/dd)',//创建日期 
            'commons|0-10': ['@id'],//评论 
            title: '@ctitle(1,30)',//标题
            'id': '@id',
            'stars|0-20': ['@id'],//被收藏的id
        },
    ],
})

// console.log(JSON.stringify(startData));

export {
    startData
}