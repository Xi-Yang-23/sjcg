import { connect } from "mongoose";

// 超级角色
const root = 'mongodb://root:63847yedh7@127.0.0.1:27017/sjcg'

// 用户只读角色
const read = 'mongodb://read:1924734qwe@127.0.0.1:27017/sjcg'

// 用户读写角色
const readWrite = 'mongodb://readWrite:36436qwyh@127.0.0.1:27017/sjcg'

const rolesArr = [read, readWrite, root]

/**
 * 连接数据库
 * @param {Number} roles 角色，默认：0 ，用户只读角色 | 0 用户只读角色 | 1 用户读写角色 | 2 超级角色
 */
const conDb = (roles = 0) => connect(rolesArr[roles]).catch(err => false)

export default conDb