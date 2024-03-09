import service from "./ax.js"

/** Post 忘记密码
 * @param {Object} cfg 传入post的data对象 
 */
const updatapwd = async (cfg) => {
    return await service('/api/updatapwd', {
        method: 'post',
        data: cfg
    })
}
export default updatapwd 