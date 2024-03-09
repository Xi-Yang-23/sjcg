// 导入nodemailer
import nodemailer from 'nodemailer'

/**
 * 发送邮件
 * @param {type:Email, Default:none} fromEmail 发出邮件的邮箱
 * @param {type:Email, Default:none} toEmail  给谁发送邮件的邮箱
 * @param {type:Email, Default:none} user 发送邮件的邮箱
 * @param {type:String, Default:none} pass 邮箱授权码
 * @param {type:String|NUmber,, Default:none} sendText 发送的信息
 * @param {type:String , Default:'smtp.qq.com'} host   邮箱服务的host，例如QQ是【smtp.qq.com】，网易是【smtp.163.com】，其它邮箱自行查
 * @return {Boolean} true  发送成功 | false 出错,邮箱不合法,或把发件人设为黑名单,或不接受陌生人邮件、或其他原因
 */
export default async function sendEmail(fromEmail, toEmail, user, pass, sendText, host = 'smtp.qq.com') {
    let transporter = nodemailer.createTransport({
        /**
         * 邮箱服务的host: 
         * qq: smtp.qq.com 
         * 163: smtp.163.com 
         */
        host: host,
        // 开启安全连接，这个开不开都可以，对安全性有要求的话，最好开启
        secureConnection: true,
        auth: {
            user: user,// 你发送邮件的邮箱
            pass: pass, // 你发送邮件的邮箱的授权码
        },
        tls: {
            rejectUnauthorized: false, // 拒绝认证就行了， 不然会报证书问题
        },
    });

    let res = true
    await transporter.sendMail({
        from: '"来自" <' + fromEmail + '>', //发送邮件的邮箱信息
        to: toEmail, // 发送给谁的邮箱
        subject: "验证码", // 标题
        // text: sendText, //发送文本
        // 发送html
        html: sendText,
        //  // 发送邮箱附件
        //  attachments: [{
        //     // 文件名
        //     filename: 'server.js',
        //     // 文件路径
        //     path: './server.js'
        // }] 
    }).catch(err => {
        res = false
    })

    return res
}
