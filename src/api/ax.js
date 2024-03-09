import axios from 'axios'
import { storeToRefs } from 'pinia'
import useUserInfoStore from '../stores/userInfo.js'
import updateToken from './updateToken.js'
import bwsRsa from '../utils/priAndPubKey.js'
import { AES, createAESKey } from '../utils/aes.js'
import md5 from '../utils/md5.js'
import qdPkAndPrKey from '../utils/aqCfg.js'
import { Notify, uid } from 'quasar'


// 创建一个 axios 实例
const service = axios.create({
    timeout: 5000,
})

let tokenUpdateing = false,//token是否处于更新中
    reqLists = []//更新token时请求的数组 

// 请求拦截器
service.interceptors.request.use(config => {
    const { url } = config

    // 拦截token
    // 需要token的url
    if (!/\/api\/(login|register|updatetoken|see)/.test(url)) {
        const userInfoStore = useUserInfoStore(),
            { token, uid: UserUid } = storeToRefs(userInfoStore)

        // 已登录，携带token访问
        if (token && token.value) {
            UserUid.value = null
            config.headers.token = token.value
        } else {
            // 未登录 -> 分配一个游客uid 
            if (token && !token.value && !UserUid.value) {
                const createUid = uid()
                config.headers.uid = createUid
                UserUid.value = createUid
            } else {
                config.headers.uid = UserUid.value
            }
        }
    }


    return config

}, error => Promise.reject(error))

// 响应拦截器
service.interceptors.response.use(async res => {
    const { statu } = res.data;

    // token过期
    if (statu === 400) {
        const userInfoStore = useUserInfoStore()

        //  更新token中，先将请求配置push到reqLists，token更新完成后再重新发起请求
        if (tokenUpdateing === true) {
            //token更新中，将请求挂起
            return new Promise(resolve => {
                // token更新中，push请求  
                const findRepeat = reqLists.findIndex(val => JSON.stringify(val) === JSON.stringify(res.config))

                if (findRepeat === -1) reqLists.push(res.config)

                resolve(service(res.config))
            })


        } else {
            // 开始更新token
            tokenUpdateing = true;


            const { email } = userInfoStore;

            const nt = new Date().getTime(),
                aesKey = createAESKey(),
                desEmail = AES(email, aesKey),
                sign = md5(email + nt + 'updateTokens').toLocaleUpperCase(),
                key = bwsRsa(aesKey, qdPkAndPrKey.pubkey)

            const {
                key: k,
                token: t,
                statu: upTokenStatu
            } = await updateToken({
                email: desEmail,
                nt,
                key,
                sign,
            })

            if (upTokenStatu !== 200) {
                reqLists = []//清空 
                userInfoStore.$reset()//清空登录信息

                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '登录过期，请重新登录',
                    textColor: 'white'
                })

                userInfoStore.loginAlert = true
                return service(res.config)

            } else {
                const enKey = bwsRsa(k, qdPkAndPrKey.prikey, 1)
                userInfoStore.token = AES(t, enKey, 1)

                // token更新完成 ——> 重新发起请求
                reqLists.forEach(it => service(it))
                reqLists = []//清空 
                tokenUpdateing = false
                return service(res.config)
            }
        }
    }

    return res.data

}, error => {
    Promise.reject(error)
})



export default service



