import { nodeRsa } from "../../utils/nodePubPrikey.js"
import md5 from "../../utils/md5.js";
import { hd } from "../cfg.js";
import { AES } from "../../utils/aes.js";
import Users from "../mongoose/models/usersModel.js";
import { verToken } from "../jwt.js";
// import { conn, closeConn } from "../mongoose/index.js";

// const conDb = await conn(1)// 数据库连接 
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
    res.flushHeaders()

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
        return res.end()
    }

    // 解构出email
    const { email: em } = tkIsGood


    // 注意：数据库要在延迟后再操作，否则连接不成功

    // conDb = await conn(1)// 数据库连接

    //  数据库连接失败
    // if (conDb === false) {console.log(',,,,,,,,,');
    //     return res.end()
    // }

    const findUser = await Users.findOne({ email: em })

    // 用户上线
    console.log(`用户${em}已上线`);
    // 没有这个邮箱用户
    if (!findUser) {
        clearInterval(timer)
        return res.end()
    }

    // 用户刚上线
    if (findUser.online !== 0) {
        findUser.online = 1
        await findUser.save()
    }

    timer = setInterval(async () => {
        // 前端推送
        const UserStatu = res.write('data:hi\n\n')

        // 用户断开连接 
        if (!UserStatu) {
            clearInterval(timer)
            return res.end()
        }

        pushCount++
        console.log('---------', pushCount);
    }, 3000);


    req.on('close', async () => {
        if (findUser) {
            findUser.online = 0
            await findUser.save()
            // await closeConn()//关闭数据库连接 
            console.log(`用户${em}已离线，关闭数据库`);
        }
    })

}

export default servSse