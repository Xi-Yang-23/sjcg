import service from "./ax.js"

const register = async (cfg) => {
    return await service('/api/register', cfg)
}

export default register