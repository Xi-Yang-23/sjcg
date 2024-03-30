import mongoose from "mongoose";
const { connection, connect } = mongoose

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
// const conn = async (roles = 0) => await connect(rolesArr[roles]).catch(err => console.log(err))

/**
 * 关闭连接
 */
// const closeConn = async () => await connection.close()

await connect(rolesArr[1]).catch(err => console.log(err))

// const closeConn=0, conn = 0
// export {
//     closeConn,
//     conn
// }