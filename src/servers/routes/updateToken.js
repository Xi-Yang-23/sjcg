import { AES, createAESKey } from "../../utils/aes.js";
import md5 from "../../utils/md5.js";
import { nodeRsa } from "../../utils/nodePubPrikey.js";
import { hd, tokenSaveTime } from '../cfg.js'
import { qqEmailRules } from "../../utils/rules.js";
import Users from "../mongoose/models/usersModel.js";
import { getToken } from "../jwt.js";
// import { conn, closeConn } from "../mongoose/index.js";


const { prikey, pubkey } = hd

/**
 * @api {get} /api/updatetoken 更新token
 * @apiVersion 0.0.0 
 * @apiName 获取验证码
 * @apiGroup 更新
 * @apiDescription 公开接口，无需权限
 * @apiSampleRequest off
 * @apiBody {Number} key aes密钥(已加密)
 * @apiBody {Number} email QQ邮箱数字(已加密)
 * @apiBody {Number} nt 当前时间戳
 * @apiBody {String} sign 签名，签名格式<code>md5(email + nt + 'updateTokens').toLocaleUpperCase()</code>
 * @apiSuccess {Number} statu <code>200</code>更新成功。<br/>token刷新规则：<br/>1、15分钟过期。<br/>2、刷新上限100次，超过100次重新登录。<br/>3、上次token刷新时间是3天内、没有刷新到上限次数，可刷新token。<br/><br/><code>201</code>邮箱不合法<br/><code>202</code>签名被非法篡改<br/><code>203</code>token刷新次数达到上限。需重新登录<br/><code>204</code>更新失败，没有这个邮箱用户<br/><code>205</code>3天内没有的路过，需重新登陆
 * @apiSuccess {String} key key（已加密）
 * @apiSuccess {String} token token（已加密）
 */
const updateToken = async (req, res) => {
    const { email, nt, sign, key } = req.query
    const deKey = nodeRsa(key, prikey)
    const deEmail = AES(email, deKey, 1)
    const rulesSing = md5(deEmail + nt + 'updateTokens').toLocaleUpperCase()

    // 签名被篡改
    if (sign !== rulesSing) {
        return res.json({
            statu: 202
        })
    }

    // 邮箱校验  |  split("@")[0]截取qq邮箱数字
    if (qqEmailRules(Number(deEmail.split("@")[0])) !== true) {
        // 邮箱不合法
        return res.json({
            statu: 201
        })
    }

    // await conn(1)//连接数据库

    // 查找用户
    const findUser = await Users.findOne({ email: deEmail })
    // 没有这个邮箱的用户
    if (!findUser) {
        // closeConn()//关闭数据库连接
        return res.json({
            statu: 204
        })
    }


    // 判断3天内是否登陆过
    const ntMsCha = new Date().getTime() - new Date(findUser.token.updatedAt).getTime()//当前时间戳-上一次toen更新时间戳
    // 3天未登陆过
    if (ntMsCha > tokenSaveTime) {
        // closeConn()//关闭数据库连接
        return res.json({
            statu: 205
        })
    }

    // 更新token次数|上限100次|token过期时间15分钟
    findUser.token.upCount++
    const saveUserTokenCount = await findUser.save().catch(err => false)
    //token刷新次数达到上限。需重新登录
    if (!saveUserTokenCount) {
        // closeConn()//关闭数据库连接
        return res.json({
            statu: 203
        })
    }


    const aesKey = createAESKey()
    let nowToken = getToken(deEmail),
        aesToken = AES(nowToken, aesKey)
    const desKey = nodeRsa(aesKey, pubkey, 1)
    // closeConn()//关闭数据库连接
    res.json({
        token: aesToken,
        statu: 200,
        key: desKey
    })
}

export default updateToken