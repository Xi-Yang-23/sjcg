import JSEncrypt from 'jsencrypt'  // 引入jsencrypt库  RSA 加、解密

/**
 * RSA 加、解密 | 仅前端可用
 * @param {String} txt 加解密字符
 * @param {String} key 密钥
 * @param {Number,default:0 加密 | 0 加密 |1 解密} t 操作类型 
 * @returns {String} 返回加解密字符
 */
const bwsRsa = (txt, key, t = 0) => {
    const jsencrypt = new JSEncrypt()
    let resData = null

    // 加密
    if (t === 0) {
        jsencrypt.setPublicKey(key)
        resData = jsencrypt.encrypt(txt)
        // 获取公私key
    } else {
        jsencrypt.setPrivateKey(key)
        resData = jsencrypt.decrypt(txt)
    }

    return resData
}

export default bwsRsa 
