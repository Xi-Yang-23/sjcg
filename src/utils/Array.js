
/**
 * 随机数组顺序
 * @param {Array} arr 数组
 * @returns Array
 */
const shufArr = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr
}
 

/**
 * !查询数组某个属性搜存在
 * @param {Array} findArr 查询的数组
 * @param {String} info 查询的属性
 * @param {String} val 查询的值
 * @returns Number 返回下标 | -1 未找到
 */
export const findArrIndex = (findArr, info, val) => {
    const musicLen = findArr.length
    if (musicLen === 0) return -1
    return findArr.findIndex(it => it[info] === val)
}

export default shufArr
