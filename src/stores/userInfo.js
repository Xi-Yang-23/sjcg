import { defineStore } from 'pinia'

const useUserInfoStore = defineStore('userInfo', {
    state: () => ({
        email: null,
        userName: null,
        token: null,
        avatar: null,
        bg: null,
        loginAlert: false,//登录弹窗
        uid: null,//游客的uid，不是游客则携带token访问
        role: -1,
        sex: 0,
        online: -1,//在线状态 : -1 未知 | 0 离线 | 1 在线
        describe: null,//简介
    }),
    persist: {
        paths: ['email', 'userName', 'token', 'avatar', 'bg', 'uid', 'role', 'sex', 'describe'],//持久化  
    },

    getters: {

    },

    actions: {
    }
})


export default useUserInfoStore