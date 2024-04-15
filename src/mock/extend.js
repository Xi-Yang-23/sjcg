import mockjs from "mockjs"
import musicList from "./musicList.js"

/**
 * 随机音乐
 */
mockjs.Random.extend({
    music: function (date = musicList) {
        var constellations = date
        return this.pick(constellations)
    }
})

/**
 * 随机图片
 */
mockjs.Random.extend({
    myimg: function (date = [
        '/testImg/alley-89197_1920.jpg',
        '/testImg/bridge-336475_1920.jpg',
        '/testImg/Car.jpg',
        '/testImg/Hatsune-Miku-1503769-wallhere.com.jpg',
        '/testImg/nature-1563305-wallhere.com.jpg',
        '/testImg/OIP-C.jpg',
        '/testImg/photo0000-1246.jpg',
        '/testImg/QQ图片20221020083629.jpg',
        '/testImg/QQ图片20221020083708.jpg',
        '/testImg/red heart tree.jpg',
        '/testImg/red roses.jpg',
        '/testImg/ripples-of-sand-in-black-and-white.jpg',
        '/testImg/road-1072821_1920.jpg',
        '/testImg/Spring in japan.jpg',
    ]) {
        var constellations = date
        return this.pick(constellations)
    }
})




// const txt = `alley-89197_1920.jpg
// bridge-336475_1920.jpg
// Car.jpg
// Hatsune-Miku-1503769-wallhere.com.jpg
// nature-1563305-wallhere.com.jpg
// OIP-C.jpg
// photo0000-1246.jpg
// QQ图片20221020083629.jpg
// QQ图片20221020083708.jpg
// red heart tree.jpg
// red roses.jpg
// ripples-of-sand-in-black-and-white.jpg
// road-1072821_1920.jpg
// Spring in japan.jpg
// `
// const arr = txt.split(/\n/)
// let b = []
// arr.forEach(it => b.push('/testImg/' + it))
// console.log(
//     b

// );