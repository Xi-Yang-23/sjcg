import { nodeRsa } from "../../utils/nodePubPrikey.js"
import md5 from "../../utils/md5.js";
import { hd } from "../cfg.js";
import { AES, createAESKey } from "../../utils/aes.js";
import Users from "../mongoose/models/usersModel.js";
import { pwdRules, qqEmailRules } from "../../utils/rules.js";
import by from "../../utils/pwdBiDui.js";
import { getToken, verToken } from "../jwt.js";


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

const home = async (req, res) => {
    // const {
    //     key,
    //     pwd,
    //     email,
    //     sign,
    //     nt
    // } = req.query  
    res.json({
        statu: 200,
        msg: 'ok'
    })
}

export default home