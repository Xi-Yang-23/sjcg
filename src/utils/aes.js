import CryptoJS from 'crypto-js'// aes加解密

/**
 * AES加解密 
 * @param {String} txt 加解密的文本
 * @param {String} key 密钥
 * @param {Number} t default:0 加密 | 0 加密 | 1 解密 | 操作类型
 * @returns 加密后的字符串
 */
const AES = (txt, key, t = 0) => {
    // 加密
    if (t === 0) {
        if (txt) {
            const encrypt = CryptoJS.AES.encrypt(txt, key)
            return encrypt.toString()
        }
        return null
    } else {
        // 解密
        if (txt) {
            const decrypted = CryptoJS.AES.decrypt(txt, key).toString(CryptoJS.enc.Utf8)

            return decrypted
        }
        return null
    }
}

/**
 * 创建AES密钥
 * @param {Number}  num defalut:10 生成几位数的key
 * @returns {String} 返回密钥
 */
const createAESKey = (num = 10) => {
    const library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+-./~=()[]{};:'?><,`";
    let key = ""
    for (var i = 0; i < num; i++) {
        let randomPoz = Math.floor(Math.random() * library.length);
        key += library.substring(randomPoz, randomPoz + 1);
    }
    return key
}


export {
    AES,
    createAESKey
}
