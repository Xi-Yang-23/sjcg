import { nodeRsa } from "../../utils/nodePubPrikey.js"
import md5 from "../../utils/md5.js";
import { hd, ramNum } from "../cfg.js";
import { AES } from "../../utils/aes.js";
import Users from "../mongoose/models/usersModel.js";
import Yzm from "../mongoose/models/yzmModel.js";
import {
    yzmRules,
    pwdRules,
    qqEmailRules
} from "../../utils/rules.js";
import by from "../../utils/pwdBiDui.js";
import newUserDir from "../newUserDir.js";
// import { conn, closeConn } from "../mongoose/index.js";


/**  
 * @api {post} /api/register 注册 
 * @apiVersion 0.0.0
 * @apiName 注册
 * @apiGroup 新用户
 * @apiDescription 公开接口，曲无需权限
 * @apiSampleRequest off
 * @apiBody {String} sign 签名。签名格式<code>md5(yzm + pwd + email + nowTime + 'register').toLocaleUpperCase()</code>
 * @apiBody {Number} yzm 验证码（已加密）
 * @apiBody {String} pwd 密码（已加密）
 * @apiBody {String} email QQ邮箱数字（已加密）
 * @apiBody {String} key aes的密钥（已加密）
 * @apiSuccess  {Number} statu <code>200</code>注册成功<br/><code>201</code>密码、邮箱、验证码校验不通过<br/><code>202</code>邮箱已被注册过<br/><code>203</code>验证码失效<br/><code>204</code>验证码错误<br/><code>205</code>签名被篡改过
 */
const register = async (req, res) => {
    const {
        yzm,
        pwd,
        email,
        sign,
        nt,
        key
    } = req.body

    const deKey = nodeRsa(key, hd.prikey)
    const deEmail = AES(email, deKey, 1)
    const deYzm = AES(yzm, deKey, 1)
    const dePwd = AES(pwd, deKey, 1)
    const nowEmail = deEmail + '@qq.com'

    const rulesSing = md5(deYzm + dePwd + nowEmail + nt + 'register').toLocaleUpperCase()

    // 签名被篡改 
    if (rulesSing !== sign) {
        return res.json({
            statu: 205,
        })
    }


    const pwdR = pwdRules(dePwd)
    const emailR = qqEmailRules(deEmail)
    const yzmR = yzmRules(deYzm)
    // 校验不通过
    if (pwdR !== true || emailR !== true || yzmR !== true) {
        return res.json({
            statu: 201,
        })
    }

    // 连接数据库
    // await conn(1)

    const findEmail = await Users.findOne({ email: nowEmail })
    // 邮箱已被注册过
    if (findEmail) {
        // closeConn()//关闭数据库连接
        return res.json({
            statu: 202,
        })
    }

    // 邮箱未被注册过  
    const findYzm = await Yzm.findOne({ email: nowEmail })//查找验证码
    // 未找到验证码，验证码失效
    if (!findYzm) {
        // closeConn()//关闭数据库连接
        return res.json({
            statu: 203,
        })
    }

    // 找到验证码
    // 验证码正确
    if (findYzm.val === Number(deYzm)) {
        // 注册成功 
        const p = by(dePwd)

        let userName = await Users.countDocuments()
        userName = '默认昵称' + userName + ramNum(3)

        // 创建新用户
        await new Users({
            pwd: p,
            email: nowEmail,
            userName: userName
        }).save()

        await findYzm.deleteOne()
        // closeConn()//关闭数据库连接

        // 创建默认头像,背景,文件夹
        newUserDir(nowEmail)

        return res.json({
            statu: 200,
        })

    }

    // 验证码错误
    // closeConn()//关闭数据库连接
    res.json({
        statu: 204,
    })
}

export default register