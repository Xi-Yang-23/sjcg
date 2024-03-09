import useUserInfoStore from "../stores/userInfo.js"
import { AES, createAESKey } from "./aes.js"
import qdPkAndPrKey from "./aqCfg.js"
import md5 from "./md5.js"
import bwsRsa from "./priAndPubKey.js"

/** 建立信息推送
 * @returns 0 无token不建立链接  
 */
const sse = () => {
    const userInfoStore = useUserInfoStore(),
        { token } = userInfoStore;

    if (token === null) return 0

    const nt = new Date().getTime(),
        aesKey = createAESKey(),
        desToken = AES(token, aesKey),
        desAesKey = bwsRsa(aesKey, qdPkAndPrKey.pubkey),
        sign = md5(`nt=${nt}&create=see`).toLocaleUpperCase();

    const seeInfo = `sign=${sign}&key=${desAesKey}&token=${desToken}&nt=${nt}`

    const startSee = new EventSource(`/api/see?${seeInfo}`, {
        withCredentials: true,
    })
    startSee.addEventListener('message', msg => {
        // console.log(msg)
    })

    // sse 连接成功
    startSee.addEventListener('open', msg => {
        userInfoStore.online = 1
    })

    // sse 连接失败
    startSee.addEventListener('error', err => {
        userInfoStore.online = false
    })
}
export default sse