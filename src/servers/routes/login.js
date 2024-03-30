import { nodeRsa } from "../../utils/nodePubPrikey.js"
import md5 from "../../utils/md5.js";
import { hd } from "../cfg.js";
import { AES, createAESKey } from "../../utils/aes.js";
import Users from "../mongoose/models/usersModel.js";
import { pwdRules, qqEmailRules } from "../../utils/rules.js";
import by from "../../utils/pwdBiDui.js";
import { getToken } from "../jwt.js";
// import { conn, closeConn } from "../mongoose/index.js";



/**  
 * @api {post} /api/login 登录 
 * @apiVersion 0.0.0
 * @apiName 登录
 * @apiGroup 新用户
 * @apiDescription 公开接口，曲无需权限
 * @apiSampleRequest off
 * @apiBody {String} sign 签名。签名格式<code>md5(pwd + email + nt + 'login').toLocaleUpperCase()</code>
 * @apiBody {String} pwd 密码（不可逆加密）
 * @apiBody {String} email QQ邮箱数字（已加密）
 * @apiBody {String} key aes的密钥（已加密）
 * @apiBody {Number} nt 当前时间戳
 * @apiSuccess  {Number} statu <code>200</code>登录成功<br/><code>201</code>密码、邮箱校验不通过<br/><code>202</code>密码错误<br/><code>203</code>签名被篡改过<br/><code>204</code>邮箱不存在
 */
const login = async (req, res) => {
    const {
        key,
        pwd,
        email,
        sign,
        nt
    } = req.body

    const deKey = nodeRsa(key, hd.prikey)
    const desEmail = AES(email, deKey, 1)
    const desPwd = AES(pwd, deKey, 1)
    const nowEmail = desEmail + '@qq.com'
    const NowSing = md5(desPwd + nowEmail + nt + 'login').toLocaleUpperCase();

    // 签名被篡改
    if (NowSing !== sign) {
        return res.json({
            statu: 203
        })

    }


    // 签名正常
    // 校验邮箱+密码
    const emailRule = qqEmailRules(desEmail)
    const pwdR = pwdRules(desPwd)
    // 邮箱校验不通过 
    if (emailRule !== true && pwdR !== true) {
        return res.json({
            statu: 201
        })
    }

    // await conn(1)//连接数据库 
    // 校验邮箱+密码校验通过 
    const findUser = await Users.findOne({ email: nowEmail });  //  查询邮箱 
    // 邮箱不存在
    if (!findUser) {
        // closeConn()//关闭数据库连接
        return res.json({
            statu: 204
        })
    }


    // 邮箱存在
    const pwdBidui = by(desPwd, findUser.pwd)
    // 密码错误
    if (!pwdBidui) {
        // closeConn()//关闭数据库连接
        return res.json({
            statu: 202
        })
    }

    // 密码正确
    const aesKey = createAESKey()
    const token = getToken(findUser.email),
        u = AES(findUser.userName, aesKey),
        e = AES(findUser.email, aesKey),
        k = nodeRsa(aesKey, hd.pubkey, 1),
        desToken = AES(token, aesKey)

    // 重置token登录次数
    findUser.token.upCount = 0
    await findUser.save()
    res.json({
        statu: 200,
        token: desToken,
        userName: u,
        email: e,
        key: k,
        describe: findUser.describe,
        sex: findUser.sex,
        role: findUser.role,
    })

    // closeConn()//关闭数据库连接
}

export default login