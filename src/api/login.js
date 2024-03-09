import service from "./ax.js"
/**
 * post
 * @param {Object} cfg  请求配置
 */
const login = async (cfg) => await service('/api/login', cfg)

export default login