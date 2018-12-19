//抽取主页路由
//注册引入路由
const express= require('express')
const router = express.Router()
const ctrl = require('../controller/index')
//处理逻辑中间件
    //客户端访问根目录时返回主页面
    router.get('/',ctrl. getIndexHandler)

    //暴露路由以便引入
    module.exports= router

