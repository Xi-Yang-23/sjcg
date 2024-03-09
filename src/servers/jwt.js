import jwk from "jsonwebtoken";
import { jwkInfo } from "./cfg.js";

/**
 * 获取token
 * @param {email} email 邮箱，最好不要用敏感信息，例如登录密码
 * @param {String} time 默认 15分钟（900s） |　token有效期 jwkInfo.expiresIn 
 * @returns 
 */
const getToken = (email, time = jwkInfo.expiresIn) => {
    let token = jwk.sign({ email }, jwkInfo.key, {
        expiresIn: time, //24h 200sm 23s | token有效期 jwkInfo.expiresIn 
    })
    return token
}

/**
 *  校验token
 * @param {String} token 
 * @returns Object 成功 | false 失败
 */
const verToken = (token) => {
    return jwk.verify(token, jwkInfo.key, (err, data) => {
        if (err) return false
        return data
    })
}

export {
    getToken,
    verToken
}