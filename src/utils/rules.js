/**
 * 校验验证码
 * @param {Number} val 验证码
 * @returns 
 */
const yzmRules = (val) => {
    const reg = /[\d]{6}/.test(val)

    return reg || '请输入正确的6位数字验证码'
}

/* 
需求：密码验证
- 密码6 - 20位
    - 由数字字母下划线(_)组成

验证：
1. 包含数字 + 小写字母通过验证
2. 包含数字 + 大写字母通过验证
3. 包含大小写字母通过验证
4. 包含数字 + 大小写字母通过验证
5. 下划线(_)可有可无 
*/

/**
 * 校验密码
 * @param {String} val  密码的字符串
 * @returns Boolean
 */
const pwdRules = val => {
    const pwdReg = /(?!^\d{6,20}$)(?!^[a-z]{6,20}$)(?!^[A-Z]{6,20}$)(?!^_{6,20}$)^\w{6,20}$/g.test(val);


    return pwdReg || '请输入由6-20位数字、字母、下划线、组成的字符'
}

/**
 * 用户简介替换多换行未1换行 ，多空格为1空格
 * @param {String} txt 处理的字符
 * @returns String 返回处理的字符串
 */
const describeReplace = txt => {
    // 多个换行替换未一个换行
    const rep = txt.replace(/([\r\n]){2,}/g, "\n").trim()
    return userNameReplace(rep)
}



/**
 * 校验简介
 * @param {String} txt 校验的字符串
 * @returns true 校验成功 | string 失败
 */
const describeRule = txt => {
    const rep = describeReplace(txt)

    if (rep.length > 4 && rep.length <= 200) return true

    return '请输入5-200字以内的简介'
}



/**
 * 校验QQ邮箱
 * @param {Number} Email QQ邮箱的数字
 * @returns Boolean true 合法 | false 不合法
 */
const qqEmailRules = Email => {
    //2空格以上替换为1空格  
    let regExp = /^[1-9]\d{4,11}$/.test(Email);

    return regExp || '请输入正确的QQ邮箱'
}

/**
 * 2空格以上替换为1空格 | 删除前后空格
 * @param {String} txt 处理的字符串
 * @returns String 返回处理过的字符
 */
const userNameReplace = txt => txt.replace(/\s{2,}/g, ' ').trim()

/**
 * 用户昵称校验
 * @param {String} userName 用户昵称
 * @returns true 成功 string 失败
 */
const userNameRules = userName => {
    const umRepSpa = userNameReplace(userName) //2空格以上替换为1空格  
    const txt = '用户名2-15字符， | 不能是下划线，最多一个空格 | 只能中、英文、数字 。 不能纯数字，及其它符号'

    const numCount = /(\d){3,}/.test(umRepSpa)//数字连续出现6次  

    if (numCount === true) return '不能以连续数字改名'

    const unReg = /(?!^\d+$)^[a-zA-Z0-9\s\u4e00-\u9fa5]{2,15}$/.test(umRepSpa)// 不能纯数字 ，用户名2-15字符  | 用户名校验 2-15字 | 不能是下划线 最多一个空格 | 只能中、英文、数字 。 不能纯数字，及其它符号  

    // res -》 true 合法| String 不合法
    const res = unReg === true ? true : txt

    return res
}


/**
 * 贡献值验证
 * @param {Number} val 贡献值
 */
const giveGxinRule = val => {
    const len = val.length
    if (len > 4) return '只能输入4位数字，最多9999'
    const test = /\d/.test(val)

    if (test) return true

    return '只能输入数字'
}

/**
 * 收藏夹名称校验 2-30字符之间
 * @param {String} val 校验的文本
 * @returns Boolean
 */
const newColsRule = val => {

    const replaceSpace = val.replace(/\s/gi, ''),
        valLen = replaceSpace.length;

    if (!valLen) return false

    if (valLen >= 2 && valLen < 30) return true

}

export {
    newColsRule,

    yzmRules,
    pwdRules,
    qqEmailRules,
    userNameRules,
    userNameReplace,
    describeReplace,
    describeRule,
    giveGxinRule
}