import MD5 from "crypto-js/md5.js";
/**
 * MD5加密
 * @param {String} text 加密的字符串
 * @returns {String} 返回加密的md5字符串
 */
const md5 = (text) => {
    return MD5(text).toString()
}

export default md5