const hd = {
    prikey: '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIICXAIBAAKBgQCJmxysreMxe+fZlFowLFq6LsQv+shD+UMHZJuej/7PiMyufKDI\n' +
        'c9sTey1ZLRJDAUDWgEuJdxupMIfDUC73YmSeltGtmrprUGIfIKiMdJIDl1gZiAv6\n' +
        'w24hs9dTnxcA0/qzGsH1VfFliJ15jkYmjFk9clibKANRb/pTYeTEKm6R0QIDAQAB\n' +
        'AoGAC4b05fpDF/gbOfzVeUed6g7U3HgToq4U0V+6MZQ6ckQxcUR7a49ZAM7Gw7uk\n' +
        '1fwa5F0m9sMFjCzGkrP62zpg11CqMny3ag3tfRruOZ9Uq5cfG8ruxYndsqmnpbyM\n' +
        '2VR6lZ3UQFwvmNBQMuVSfW2OdI5g7rZVJ2ZMH2f8IEeO7AECQQDFpUBfek97exY2\n' +
        'K3DuQp6ACbh+hHf6E83e6a/2LMHG6EKittL9sTgVUdDNyN5CW9LE29ngbhV/JigK\n' +
        'Fxcw2lCxAkEAsjvarTglSBm4aaJK6/NNyR8NqRJaj8Djq2m0QD/dcE4fIGKCqZNp\n' +
        'm4lvO4dRzKc9ILAXNO/lU8zoqB9cCh+bIQJAdkRcMMXPqeQNdnyoJupWTeeDLrG1\n' +
        '2T7ggfL0CCrgCVYSCau8tXHGTXuXpov781le1c14ooM8+cirTN5kUidRAQJAVLnj\n' +
        'QAi6oEWpxn1hxDxKs9rRMZgJ+OAm2itLhmdVqrdYUJrDpjzvLQLuH4w6NGEjy9Ap\n' +
        'l/6aM3Xq+1C8/gr8QQJBAKtjjcdWmxiUd8/YV6TNDSJ0XlM7ESknuDUe8JZApjKb\n' +
        'Bvnool/72/9ssFPCNN9psSvuYyF6IyPalblj+v+XKkw=\n' +
        '-----END RSA PRIVATE KEY-----',

    pubkey: '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDqt0u8uQjo7ANCQGQ3AkbXIyA7\n' +
        'wEaXnvoRO2UHJ4YtLtBaC+1sTWaLYMNUdE0nBc1WXZOEcgz30BMVMzzGA08+kmps\n' +
        'l707MGDf86UvRPh72uJpRP8r2FltBrvP4lKkHrne8WHISwxa76BXoMtLXV4f0C7/\n' +
        'XHzeKkFPvJLlsqOWxwIDAQAB\n' +
        '-----END PUBLIC KEY-----',

}

// 邮箱配置
const sendEmailInfo = {
    pass: 'fpnghxnmnyghdifg',
    email: '2276993420@qq.com',
}



/**
 * 生成N位随机数字
 * @param {Number} l 默认：6，默认生成6位随机数字
 * @returns 返回N位随机数字
 */
const ramNum = (l = 6) => Number(String(Math.random()).substr(2, l))


//token的保存时间。3天的毫秒数  | token登录保持3天| 单位： 毫秒 
const tokenSaveTime = 1000 * 60 * 60 * 24 * 3

const jwkInfo = {
    expiresIn: "900s", //token有效期
    key: 'MyNameIsShuaiBi'//token的key
}

export {
    hd,
    sendEmailInfo,
    ramNum,
    jwkInfo,
    tokenSaveTime
}  