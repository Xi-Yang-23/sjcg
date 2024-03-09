import { jwkInfo } from "../cfg.js";
import { verToken } from "../jwt.js";


// @param {正则表达式} unPath 默认： /\/api\/(login|register)/ ，不拦截token的请求路径

/**
 * @description 请求示例请无视
 * @api {null} null token拦截
 * @apiName token拦截
 * @apiVersion 0.0.0  
 * @apiGroup 中间件  
 * @apiError {Number} statu <code>400</code>token失效<br/><code>401</code>临时token失效，已重新发送新的临时token给前端
 * 
 */
/** 拦截时，如果 req.headers携带的是uid，可直接访问首页等基础信息
 * @param {正则表达式} unPath 不需要token就可以访问的路径，默认 /\/api\/(login|register|updatetoken)/ 
 */
const tokenMid = (unPath = /\/api\/(login|register|updatetoken|see)/) => {
    return (req, res, next) => {
        const { path } = req
        const { token, uid } = req.headers
        const hasPath = unPath.test(path)

        // 游客访问
        if (uid) {
            req.uid = uid
            return next()
        }


        // 不需要token 
        if (hasPath) return next()

        // 需要token     
        const tokenIsGood = verToken(token, jwkInfo.key)  // 校验token

        // 有效token
        if (tokenIsGood) {
            req.token = token
            return next()
        }

        // 无效token
        return res.json({
            statu: 400
        })
    }
}
export default tokenMid