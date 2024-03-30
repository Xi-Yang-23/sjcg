import md5 from "../../utils/md5.js";
import { qqEmailRules } from "../../utils/rules.js";
import Users from "../mongoose/models/usersModel.js";
import { verToken } from "../jwt.js";
// import { conn, closeConn } from "../mongoose/index.js";

// await conn()

/** 
 * @api {get} /api/menuauth   菜单+权限+用户基本信息
 * @apiHeader {String} token 携带token 
 * @apiVersion 0.0.0 
 * @apiName 菜单+权限
 * @apiGroup 菜单
 * @apiQuery {Number} nt 当前时间戳
 * @apiQuery {String} sign 签名，签名格式<code>md5(email + nt + 'menuAuth2024/3/5 21:35').toLocaleUpperCase()</code>
 * @apiSuccess {Number} statu <code>200</code>获取成功<br/><code>201</code>获取失败,邮箱校验失败<br/><code>202</code>签名被非法篡改<br/><code>203</code>没有这个邮箱的用户
 */
const menuAndAuth = async (req, res) => {
    const { nt, sign } = req.query
    const { token } = req.headers

    const { email } = verToken(token)
    const rulesSing = md5(email + nt + 'menuAuth2024/3/5 21:35').toLocaleUpperCase()

    // 签名被篡改
    if (sign !== rulesSing) {
        return res.json({
            statu: 202,
            msg: '出错，请重试！'
        })
    }
    // 邮箱校验失败 
    if (!qqEmailRules(Number(email.split("@")[0]))) {
        return res.json({
            statu: 201,
        })
    }

    // await conn()//连接数据库 
    const findUser = await Users.findOne({ email }, '-createdAt -updatedAt -__v -pwd -_id -role._id -token')
    // 没有这个邮箱的用户
    if (!findUser) {
        // await closeConn()//关闭数据库连接
        return res.json({
            statu: 203,
        })
    }


    // 有效邮箱  
    res.json({
        statu: 200,
        msg: findUser
    })
    // await closeConn()//关闭数据库连接
}

export default menuAndAuth