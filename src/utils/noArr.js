/**  数组去重
 * @param {Array} arr 去重的数组
 * @returns 返回去重的数组
 */
const noReArr = (arr) => [...new Set(arr)];

export default noReArr