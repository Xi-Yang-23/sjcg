import service from "./ax.js"

/** get 菜单与权限
 * @param {Object} cfg 传入get的parasm对象 
 */
const menuAndAuth = async (cfg) => await service('/api/menuauth',
    {
        params: cfg
    }
)
export default menuAndAuth