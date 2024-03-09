import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * 创建用户文件夹,默认头像,默认背景
 * @param {String} email 用户邮箱
 * @returns true 成功 | false 失败
 */
const newUserDir = (email) => {

    // 创建用户文件
    const userFload = mkdirSync(join(`../../users/${email}/articles`), { recursive: true })

    if (!existsSync(join(`../../public/imgs`))) {
        mkdirSync(join(`../../public/imgs`))
    }

    // 创建用户默认头像与背景图
    const userBgmgs = copyFileSync(join(`../../public/avatar.jpeg`), join(`../../public/imgs/avatar_${email}.jpeg`))
    const userAvatar = copyFileSync(join(`../../public/bg.jpeg`), join(`../../public/imgs/bg_${email}.jpeg`))

    if (userFload && !userBgmgs && !userAvatar) {
        return true
    }

    return false
}

export default newUserDir 