import { model, Schema } from "mongoose"


const userTokenInfo = new Schema(
    {   //更新次数 100次
        upCount: {
            default: 0,
            type: Number,
            max: 100,
            min: 0
        },
    },
    {
        timestamps: true
    }
)

// 角色shema
const roleShema = new Schema(
    {
        role: {
            type: Number,
            default: 0
        },
        // 权限
        auth: {
            type: Array,
            default: [100, 103]
        },
        menu: {
            type: Array,
            default: [
                {
                    to: "/home",
                    icon: "home",
                    label: "首页",
                },

                {
                    to: "/users",
                    icon: "person",
                    label: "我",
                },
            ]
        }
    }
)

const userSchema = new Schema({
    // 用户简介
    describe: {
        type: String,
        default: "没有任何简介!"
    },

    // token信息
    token: {
        type: userTokenInfo,
        default: () => ({})
    },

    // 在线状态 -1不在线
    online: {
        type: Number,
        default: -1
    },

    email: {
        type: String,
        required: true,
    },

    pwd: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },

    // 0女 1男
    sex: {
        type: Number,
        enum: [0, 1],
        default: 0,
    },

    // 角色
    role: {
        type: roleShema,
        default: () => ({})
    }
}, { timestamps: true })


const Users = model('users', userSchema)


export default Users 
