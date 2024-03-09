import { nodeRsa } from "../../utils/nodePubPrikey.js"
import md5 from "../../utils/md5.js";
import { hd } from "../cfg.js";
import { AES } from "../../utils/aes.js";
import Users from "../mongoose/models/usersModel.js";
import { qqEmailRules, pwdRules, yzmRules } from "../../utils/rules.js";
import by from "../../utils/pwdBiDui.js";
import Yzm from "../mongoose/models/yzmModel.js";
import conDb from "../mongoose/index.js";
import { disconnect } from "mongoose";

/**  
 * @api {post} /api/updatapwd 更新、忘记密码 
 * @apiVersion 0.0.0
 * @apiName 忘记密码
 * @apiGroup 更新
 * @apiDescription 公开接口，曲无需权限
 * @apiSampleRequest off
 * @apiBody {String} sign 签名。签名格式<code>md5(yzm + pwd + email + nt + 'updataPwds').toLocaleUpperCase()</code> 
 * @apiBody {String} email QQ邮箱数字（已加密）
 * @apiBody {String} key aes的密钥（已加密）
 * @apiBody {Number} nt 当前时间戳
 * @apiSuccess  {Number} statu <code>200</code>找回成功<br/><code>201</code>验证码、邮箱或密码校验不通过<br/><code>202</code>没有这个邮箱<br/><code>203</code>未找到验证码，验证码失效<br/><code>204</code>验证码错误<br/><code>205</code>签名被篡改 <br/><code>206</code>与旧密码一样，拒绝更改
 */
const updataPwd = async (req, res) => {
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

    const rulesSing = md5(deYzm + dePwd + nowEmail + nt + 'updataPwds').toLocaleUpperCase()

    // 签名被篡改 
    if (rulesSing !== sign) {
        return res.json({
            statu: 205,
        })
    }

    // 签名正常
    const pwdR = pwdRules(dePwd)
    const emailR = qqEmailRules(deEmail)
    const yzmR = yzmRules(deYzm)
    // 校验不通过
    if (pwdR !== true && emailR !== true && yzmR !== true) {
        return res.json({
            statu: 201,
        })
    }

    await conDb(1)//连接数据库

    // 校验通过
    const findUser = await Users.findOne({ email: nowEmail })
    // 邮箱不存在
    if (!findUser) {
        await disconnect()//销毁数据库连接
        return res.json({
            statu: 202,
        })
    }

    // 邮箱存在 
    const findYzm = await Yzm.findOne({ email: findUser.email })// 查找验证码     
    // 未找到验证码，验证码失效
    if (!findYzm) {
        await disconnect()//销毁数据库连接
        await res.json({
            statu: 203,
        })
    }


    // 验证码错误
    if (findYzm.val !== Number(deYzm)) {
        await disconnect()//销毁数据库连接
        return res.json({
            statu: 204,
        })
    }

    const isOldPwd = by(dePwd, findUser.pwd)
    // 与旧密码一样，拒绝更改
    if (isOldPwd) {
        await disconnect()//销毁数据库连接
        return res.json({
            statu: 206,
        })
    }

    // 删除验证码
    await findYzm.deleteOne()
    const p = by(dePwd)
    // 更新用户密码
    await Users.updateOne({ pwd: p })

    await disconnect()//销毁数据库连接
    // 更新成功
    res.json({
        statu: 200,
    })
}
export default updataPwd