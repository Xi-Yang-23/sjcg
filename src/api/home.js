import service from "./ax.js"

/** get 首页
 * @param {Object} cfg 传入post的data对象 
 */
const home = async (cfg) => {
    return await service('/api/home', cfg)
}
export default home