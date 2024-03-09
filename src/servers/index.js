import express from 'express'
import login from './routes/login.js';
import register from './routes/register.js';
import subYzm from './routes/subYzm.js';
import updataPwd from './routes/updataPwd.js';
import home from './routes/home.js';
import updateToken from './routes/updateToken.js';
import tokenMid from './middlewares/jwkMid.js';
import cors from 'cors'
import { dirname, join, resolve } from 'path'
import menuAndAuth from './routes/menuAndAuth.js';
import servSse from './routes/servSse.js';



const app = express(),
    router = express.Router(),
    port = 3000;


// 静态资源 
app.use(express.static(resolve(join(dirname(''), '../../ public'))))

// post的body 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(tokenMid())
app.use(cors())

app.use(router)

router.get('/api/home', home)// 首页 | tokenMid(true)
router.get('/api/updatetoken', updateToken)// 更新token
router.get('/api/menuauth', menuAndAuth)// 首页导航栏+权限
router.get('/api/see', servSse)// sse 用户在线状态+信息推送

router.post('/api/login', login)// 登录,
router.post('/api/register', register)// 注册,
router.post('/api/subyzm', subYzm)// 发送验证码,
router.post('/api/updatapwd', updataPwd)// 忘记密码,

// 错误处理
app.use((err, req, res, next) => {
    res.json({
        statu: 500
    })
})

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})

