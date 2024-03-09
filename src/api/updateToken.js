import service from "./ax.js"

/** get 更新token
 * @param {Object} cfg 传入get的params对象 
 */
const updateToken = async (cfg) => {
    return await service('/api/updatetoken', {
        method: 'get',
        params: cfg
    })
}
export default updateToken 