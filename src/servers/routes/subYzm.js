import { AES } from "../../utils/aes.js";
import md5 from "../../utils/md5.js";
import { nodeRsa } from "../../utils/nodePubPrikey.js";
import sendEmail from "../nodemailer.js";
import { hd, sendEmailInfo, ramNum } from '../cfg.js'
import Yzm from "../mongoose/models/yzmModel.js";
// import { conn, closeConn } from "../mongoose/index.js";

const { prikey } = hd

/** 
 * @api {post} /api/subyzm  发送验证码 
 * @apiVersion 0.0.0 
 * @apiName 获取验证码
 * @apiGroup 验证
 * @apiDescription 公开接口，无需权限
 * @apiSampleRequest off
 * @apiBody {Number} key aes密钥(已加密)
 * @apiBody {Number} email QQ邮箱数字(已加密)
 * @apiBody {Number} nt 当前时间戳
 * @apiBody {String} sign 签名，签名格式<code>md5(email + nt + 'yzm').toLocaleUpperCase()</code>
 * @apiSuccess {Number} statu <code>200</code>发送成功<br/><code>201</code>发送失败,可能是邮箱不合法,或把发件人设为黑名单,或不接受陌生人邮件等<br/><code>202</code>签名被非法篡改
 */
const subYzm = async (req, res) => {
    const { email, nt, sign, key } = req.body
    const deKey = nodeRsa(key, prikey)
    const deEmail = AES(email, deKey, 1)
    const nowEmail = deEmail + '@qq.com'
    const rulesSing = md5(nowEmail + nt + 'yzm').toLocaleUpperCase()

    // 签名被篡改
    if (sign !== rulesSing) {
        return res.json({
            statu: 202,
            msg: '出错，请重试！'
        })
    }

    const yzm = ramNum()
    // 邮箱未被注册 
    const sendEmailRes = await sendEmail(sendEmailInfo.email, nowEmail, sendEmailInfo.email, sendEmailInfo.pass, "你的验证码为<b style='color:skybkue;'>" + yzm + "</b>,1分钟内有效，请务透漏给别人！")

    // 邮箱验证码发送成功
    if (sendEmailRes) {
        // await conn(1)//连接数据库

        await new Yzm({
            val: yzm,
            email: nowEmail
        }).save()

        // closeConn()//关闭数据库连接

        return res.json({
            statu: 200,
        })
    }


    // 邮箱验证码发送失败 
    res.json({
        statu: 201,
    })

}

export default subYzm