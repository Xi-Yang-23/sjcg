import NodeRSA from "node-rsa"

/**
 * 后端node获取公、私钥
 * keySize {Number} 生成私钥、密钥大小，与jsencrypt保持一致，默认1024
 * @returns {Object} { pubkey,prikey} pubkey 公钥 | prikey私钥
 */

const nodeGetKey = (keySize = 1024) => {
    const nodeKey = new NodeRSA({ b: keySize })
    const pubkey = nodeKey.exportKey('public')
    const prikey = nodeKey.exportKey('private')

    return {
        pubkey,
        prikey
    }
}

/**
 * 后端Node环境RSA加解密
 * @param {String} txt 加、解密的文本
 * @param {String} key 公、私钥
 * @param {Number} t 默认：0 | 0 解密 | 1 加密
 * @returns 
 */
const nodeRsa = (txt, key, t = 0) => {
    // 解密
    if (t === 0) {
        const nodeKey = new NodeRSA(key)
        nodeKey.setOptions({ encryptionScheme: 'pkcs1' }) // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
        const decrypted = nodeKey.decrypt(txt, 'utf8')

        return decrypted
    } else {
        // 加密
        const nodeKey = new NodeRSA(key)
        nodeKey.setOptions({ encryptionScheme: 'pkcs1' })// 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
        const encrypted = nodeKey.encrypt(txt, 'base64')

        return encrypted
    }

}

export {
    nodeRsa,
    nodeGetKey,
}
