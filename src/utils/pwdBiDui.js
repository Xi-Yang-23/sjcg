import bcryptjs from 'bcryptjs'//不可逆加密 bcryptjs 

/**
 * 不可逆加密 ，一旦加密不可解密，只可比对 | 传如一个参数>加密 | 2个参数>密码比对
 * @param {String} txt 加密、比对的文本
 * @param {String} hash 加密的哈希 
 * @returns {[String|Boolear]} 返回值
 */
const by = (...args) => {
    let res = null
    const [t, h] = args

    // 比对
    if (args.length === 2) {
        res = bcryptjs.compareSync(t, h)
    } else if (args.length === 1) {
        // 加密
        res = bcryptjs.hashSync(t)
    }
    return res
}
export default by
