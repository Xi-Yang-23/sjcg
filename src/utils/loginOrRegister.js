import { reactive } from "vue";
import { Notify } from 'quasar'

import register from "../api/register.js";
import updatapwd from "../api/updataPwd.js";
import login from "../api/login.js";
import md5 from "./md5.js";
import { createAESKey, AES } from "./aes.js";
import qdPkAndPrKey from "./aqCfg.js";
import bwsRsa from "./priAndPubKey.js";
import subyzm from "../api/subYzm.js";
import {
    pwdRules,
    qqEmailRules
} from "./rules.js";
import useUserInfoStore from "../stores/userInfo.js";

const lgORs = reactive({
    title: '登录',
    loginOrRegister: false,//是否显示登录对话框 
    isLoading: false,
    type: 0,//0 登录| 1注册 | 2找回密码
    email: '',
    pwd: '',
    pwdLabel: '密码',
    yzm: '',
    pwdToText: true,//显示密码 
    subYzmText: '请发送验证码',
    subYzmBtnDisabled: false,//禁用发送验证码按钮
    isSubYzm: false,//是否已发送验证码
    subYznBtnload: false,//发送验证码按钮加载事件
})

/**
 * 登录 | 注册 | 忘记密码点击事件
 * @param {Number} t 处理类型 | 0 登录 | 1 注册 | 2 忘记密码
 */
const lgRsWjBtnck = (t) => {
    lgORs.type = t

    switch (t) {
        case 0:
            // 登录
            lgORs.title = '登录'
            lgORs.pwdLabel = '密码'
            break;
        case 1:
            // 注册
            lgORs.title = '注册'
            lgORs.pwdLabel = '密码'
            break;
        default:
            // 忘记密码
            lgORs.title = '忘记密码'
            lgORs.pwdLabel = '输入新密码'

            break;
    }
}


// 提交登录、注册
const onSubmit = async () => {
    lgORs.isLoading = true
    const userInfo = useUserInfoStore()

    const { pubkey, prikey } = qdPkAndPrKey
    const { yzm, pwd, email } = lgORs

    // 登录
    if (lgORs.type === 0) {
        const aesKey = createAESKey()
        const enAseKey = bwsRsa(aesKey, pubkey)
        const enPwd = AES(pwd, aesKey)
        const enEmail = AES(email, aesKey)

        const nt = new Date().getTime()
        const sign = md5(pwd + email + '@qq.com' + nt + 'login').toLocaleUpperCase()

        const { statu, token, email: e, userName, key, sex, role, describe } = await login({
            method: 'post',
            data: {
                key: enAseKey,
                pwd: enPwd,
                email: enEmail,
                sign,
                nt
            }
        })

        switch (statu) {
            case 201:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '请输入合法的邮箱',
                    textColor: 'white'
                })
                break;
            case 202:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '密码错误，请重试！',
                    textColor: 'white'
                })
                break;
            case 203:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '未知错误，请重试！',
                    textColor: 'white'
                })
                break;
            case 204:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '邮箱不存在，请输入合法邮箱',
                    textColor: 'white'
                })
                break;
            default:
                const desAesKey = bwsRsa(key, prikey, 1)
                const u = AES(userName, desAesKey, 1)
                const nowEmail = AES(e, desAesKey, 1)
                const enToken = AES(token, desAesKey, 1)


                userInfo.$patch({
                    token: enToken,
                    bg: `/imgs/bg_${nowEmail}.jpeg`,
                    avatar: `/imgs/avatar_${nowEmail}.jpeg`,
                    userName: u,
                    email: nowEmail,
                    sex,
                    role,
                    describe
                })

                // 关闭登录窗口
                userInfo.loginAlert = false

                // 登录成功
                Notify.create({
                    progress: true,
                    type: 'positive',
                    html: true,
                    timeout: 2500,
                    position: 'top',
                    message: '登录成功！',
                })
                break;

        }

    } else if (lgORs.type === 1) {
        // 注册
        const aesKey = createAESKey()
        const enAseKey = bwsRsa(aesKey, pubkey)
        const enYzm = AES(yzm, aesKey)
        const enPwd = AES(pwd, aesKey)
        const enEmail = AES(email, aesKey)

        const nt = new Date().getTime()
        const sign = md5(yzm + pwd + email + '@qq.com' + nt + 'register').toLocaleUpperCase()

        const { statu } = await register({
            method: 'post',
            data: {
                key: enAseKey,
                yzm: enYzm,
                pwd: enPwd,
                email: enEmail,
                sign,
                nt
            }
        })

        switch (statu) {
            case 201:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '请输入合法的密码、邮箱、验证码',
                    textColor: 'white'
                })
                break;
            case 202:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '邮箱已被注册过，换一个试试',
                    textColor: 'white'
                })
                break;
            case 203:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '验证码失效，请重新发送验证码',
                    textColor: 'white'
                })
                break;
            case 204:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '验证码错误，请重新输入',
                    textColor: 'white'
                })
                break;
            case 205:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '未知错误，请重试！',
                    textColor: 'white'
                })
                break;

            default:
                Notify.create({
                    progress: true,
                    type: 'positive',
                    html: true,
                    timeout: 2000,
                    position: 'top',
                    message: '太棒了，恭喜你注册成功！',
                })


                ///////////////////////////////======////////////////////////////////////


                lgORs.subYznBtnload = false
                lgORs.type = false

                /**
                 * 注册成功开始登录
                 */
                const enAseKey = bwsRsa(aesKey, pubkey)
                const enPwd = AES(pwd, aesKey)
                const enEmail = AES(email, aesKey)

                const nt = new Date().getTime()
                const sign = md5(pwd + email + '@qq.com' + nt + 'login').toLocaleUpperCase()

                const { statu, token, email: e, userName, key, sex, role, describe } = await login({
                    method: 'post',
                    data: {
                        key: enAseKey,
                        pwd: enPwd,
                        email: enEmail,
                        sign,
                        nt,
                        role
                    }
                })

                switch (statu) {
                    case 201:
                        Notify.create({
                            progress: true,
                            type: 'warning',
                            html: true,
                            position: 'top',
                            message: '请输入合法的邮箱',
                            textColor: 'white'
                        })
                        break;
                    case 202:
                        Notify.create({
                            progress: true,
                            type: 'warning',
                            html: true,
                            position: 'top',
                            message: '密码错误，请重试！',
                            textColor: 'white'
                        })
                        break;
                    case 203:
                        Notify.create({
                            progress: true,
                            type: 'warning',
                            html: true,
                            position: 'top',
                            message: '未知错误，请重试！',
                            textColor: 'white'
                        })
                        break;
                    case 204:
                        Notify.create({
                            progress: true,
                            type: 'warning',
                            html: true,
                            position: 'top',
                            message: '邮箱不存在，请输入合法邮箱',
                            textColor: 'white'
                        })
                        break;
                    default:
                        const desAesKey = bwsRsa(key, prikey, 1)
                        const u = AES(userName, desAesKey, 1)
                        const nowEmail = AES(e, desAesKey, 1)
                        const enToken = AES(token, desAesKey, 1)

                        const userInfo = useUserInfoStore()

                        userInfo.$patch({
                            token: enToken,
                            bg: `/imgs/bg_${nowEmail}.jpeg`,
                            avatar: `/imgs/avatar_${nowEmail}.jpeg`,
                            userName: u,
                            email: nowEmail,
                            sex,
                            role,
                            describe
                        })

                        // 关闭登录窗口
                        userInfo.loginAlert = false

                        // 登录成功
                        Notify.create({
                            progress: true,
                            type: 'positive',
                            html: true,
                            timeout: 2500,
                            position: 'top',
                            message: '太棒了，恭喜你登录成功！',
                        })
                        break;

                }

                break;
        }
    } else {
        /**
         * 找回密码 
         */
        const aesKey = createAESKey()
        const enAseKey = bwsRsa(aesKey, pubkey)
        const enYzm = AES(yzm, aesKey)
        const enPwd = AES(pwd, aesKey)
        const enEmail = AES(email, aesKey)

        const nt = new Date().getTime()
        const sign = md5(yzm + pwd + email + '@qq.com' + nt + 'updataPwds').toLocaleUpperCase()

        const { statu } = await updatapwd({
            key: enAseKey,
            yzm: enYzm,
            pwd: enPwd,
            email: enEmail,
            sign,
            nt
        })

        switch (statu) {
            case 206:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '与上次密码一样，修改失败',
                    textColor: 'white'
                })
                break;

            case 201:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '验证码、邮箱或密码校验不通过',
                    textColor: 'white'
                })
                break;
            case 202:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '没有这个邮箱',
                    textColor: 'white'
                })
                break;
            case 203:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '未找到验证码，验证码失效',
                    textColor: 'white'
                })
                break;
            case 204:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '验证码错误，请重新输入',
                    textColor: 'white'
                })
                break;
            case 205:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    html: true,
                    position: 'top',
                    message: '未知错误，请重试！',
                    textColor: 'white'
                })
                break;

            default:
                Notify.create({
                    progress: true,
                    type: 'positive',
                    html: true,
                    timeout: 3500,
                    spinner: true,
                    spinnerColor: 'primary',
                    position: 'top',
                    message: '密码已找回,登录中...',
                })


                ///////////////////////////////======////////////////////////////////////


                lgORs.subYznBtnload = false
                lgORs.type = false

                /**
                 * 注册成功开始登录
                 */
                const enAseKey = bwsRsa(aesKey, pubkey)
                const enPwd = AES(pwd, aesKey)
                const enEmail = AES(email, aesKey)

                const nt = new Date().getTime()
                const sign = md5(pwd + email + '@qq.com' + nt + 'login').toLocaleUpperCase()

                const { statu, token, email: e, userName, key, sex, role, describe } = await login({
                    method: 'post',
                    data: {
                        key: enAseKey,
                        pwd: enPwd,
                        email: enEmail,
                        sign,
                        nt,
                        sex,
                        role
                    }
                })

                switch (statu) {
                    case 201:
                        Notify.create({
                            progress: true,
                            type: 'warning',
                            html: true,
                            position: 'top',
                            message: '请输入合法的邮箱',
                            textColor: 'white'
                        })
                        break;
                    case 202:
                        Notify.create({
                            progress: true,
                            type: 'warning',
                            html: true,
                            position: 'top',
                            message: '密码错误，请重试！',
                            textColor: 'white'
                        })
                        break;
                    case 203:
                        Notify.create({
                            progress: true,
                            type: 'warning',
                            html: true,
                            position: 'top',
                            message: '未知错误，请重试！',
                            textColor: 'white'
                        })
                        break;
                    case 204:
                        Notify.create({
                            progress: true,
                            type: 'warning',
                            html: true,
                            position: 'top',
                            message: '邮箱不存在，请输入合法邮箱',
                            textColor: 'white'
                        })
                        break;
                    default:
                        const desAesKey = bwsRsa(key, prikey, 1)
                        const u = AES(userName, desAesKey, 1)
                        const nowEmail = AES(e, desAesKey, 1)
                        const enToken = AES(token, desAesKey, 1)

                        const userInfo = useUserInfoStore()

                        userInfo.$patch({
                            token: enToken,
                            bg: `/imgs/bg_${nowEmail}.jpeg`,
                            avatar: `/imgs/avatar_${nowEmail}.jpeg`,
                            userName: u,
                            describe,
                            email: nowEmail
                        })

                        // 关闭登录窗口
                        userInfo.loginAlert = false

                        // 登录成功
                        Notify.create({
                            progress: true,
                            type: 'positive',
                            html: true,
                            timeout: 2500,
                            position: 'top',
                            message: '登录成功！',
                        })
                        break;
                }

                break;
        }
    }

    lgORs.isLoading = false
}


const subEmailYzm = async () => {
    const email = lgORs.email
    // 密码与邮箱错误
    if (pwdRules(lgORs.pwd) !== true || qqEmailRules(email) !== true) {
        // 或使用配置对象：
        return Notify.create({
            progress: true,
            type: 'warning',
            html: true,
            position: 'top',
            message: '请输入正确的<b style="color:red">邮箱、密码</b>后再发送验证码！',
        })

    } else {
        // 密码与邮箱正确 
        lgORs.subYznBtnload = true
        const aesKey = createAESKey()
        const { pubkey } = qdPkAndPrKey
        const enAseKey = bwsRsa(aesKey, pubkey)
        const ensEmail = AES(email, aesKey)
        const nt = new Date().getTime()
        const sign = md5(email + '@qq.com' + nt + 'yzm').toLocaleUpperCase()

        const cfg = {
            method: 'post',
            data: {
                key: enAseKey,
                email: ensEmail,
                nt,
                sign
            }
        }
        const { statu } = await subyzm(cfg)
        lgORs.subYznBtnload = false


        switch (statu) {
            // 发送成功
            case 200:
                let s = 60,
                    timer = null;

                lgORs.subYzmBtnDisabled = true
                lgORs.isSubYzm = true
                timer = setInterval(() => {
                    s -= 1
                    lgORs.subYzmText = s + '秒后重试'

                    if (s === 0) {
                        clearInterval(timer)
                        lgORs.isSubYzm = false
                        lgORs.subYzmBtnDisabled = false
                        lgORs.subYzmText = '请发送验证码'
                    }

                }, 1000)


                Notify.create({
                    progress: true,
                    type: 'positive',
                    position: 'top',
                    message: '验证码已发送至QQ邮箱，注意查收！',
                })
                break;


            // 发送失败
            case 201:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    position: 'top',
                    message: '发送失败，请重试！',
                })
                break;

            // 签名错误
            default:
                Notify.create({
                    progress: true,
                    type: 'warning',
                    position: 'top',
                    message: '未知错误，请重试！',
                })
                break;
        }
    }
}

export {
    lgORs,
    onSubmit,
    subEmailYzm,
    lgRsWjBtnck
}