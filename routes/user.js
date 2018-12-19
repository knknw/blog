//登录与注册处理逻辑抽取路由


const express = require('express')
const router = express.Router()
const ctrl =  require('../controller/user')

//跳转到登录页面路由
router.get('/login', ctrl.getLoginHandler)
//跳转到注册页面路由
router.get('/register',ctrl.getRegisterHandler)
//注册页面
router.post('/register', ctrl.postRegisterHandler)
//登录页面
router.post('/login',ctrl.postLoginHandler)
//退出登录
router.get('/logout', ctrl.getLogoutHandler)


module.exports = router