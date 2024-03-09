import service from "./ax.js"

const subyzm = async (cfg) => {
    return await service('/api/subyzm', cfg)
}

export default subyzm