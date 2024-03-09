import { nodeRsa } from "../../utils/nodePubPrikey.js"
import md5 from "../../utils/md5.js";
import { hd } from "../cfg.js";
import { AES } from "../../utils/aes.js";
import Users from "../mongoose/models/usersModel.js";
import { disconnect } from "mongoose";
import { verToken } from "../jwt.js";
import conDb from "../mongoose/index.js";

/**  
 * @api {get} /api/see 建立信息推送连接
 * @apiVersion 0.0.0
 * @apiName 信息推送
 * @apiGroup 信息推送  
 * @apiQuery {String} sign 签名。签名格式<code>md5(`nt=时间戳&create=see`).toLocaleUpperCase()</code>
 * @apiQuery {Number} nt 时间戳 
 * @apiQuery {String} key aes的密钥（已加密）
 * @apiQuery {String} token token（已加密）
 * @apiSuccess  {Number} statu <code>响应 </code>建立连接成功<br/><br/><code>201</code>签名被篡改过<br/><br/><code>202</code>token过期
 */
const servSse = async (req, res) => {
    let pushCount = 0, timer = null
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const { key, sign, token, nt } = req.query

    const ruleSign = md5(`nt=${nt}&create=see`).toLocaleUpperCase()
    const replaceKey = key.replaceAll(' ', '+')//前端发过来的数据 + 符号被吞，重新加上
    const replaceToken = token.replaceAll(' ', '+')//前端发过来的数据 + 符号被吞，重新加上

    // 签名错误
    if (ruleSign !== sign) {
        return res.json({
            statu: 201
        })
    }

    const enKey = nodeRsa(replaceKey, hd.prikey),
        enToken = AES(replaceToken, enKey, 1),
        tkIsGood = verToken(enToken)

    // token过期
    if (!tkIsGood) {
        return res.json({
            statu: 202
        })
    }

    // 解构出email
    const { email: em } = tkIsGood

    // 注意：数据库要在定时器内操作，定时器外操作会报错
    timer = setInterval(async () => {
        // 用户上线
        if (pushCount === 0) {
            // 数据库连接
            await conDb(1)
            const findUser = await Users.findOne({ email: em })
            // 没有这个邮箱用户
            if (!findUser) {
                return res.end()
            }
            findUser.online++
            await findUser.save()
            await disconnect()//销毁数据库连接  
        }

        pushCount++

        // 前端推送
        const UserStatu = res.write('data:hi\n\n')

        // 用户断开连接 
        if (!UserStatu) {
            console.log('用户离线', pushCount);
            // 数据库连接
            await conDb(1)
            const findUser = await Users.findOne({ email: em })
            findUser.online--
            await findUser.save()
            await disconnect()//销毁数据库连接

            clearInterval(timer)
            return res.end()
        }

        console.log('---------', pushCount);
    }, 3000);
}

export default servSse