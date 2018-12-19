//添加页面路由

const express = require('express')
const router = express.Router()
const ctrl = require('../controller/article')
//发表文章页面 路由
router.get('/article/add', ctrl.getArticleAddHandler)
//发表文章 请求流程路由
router.post('/article/add', ctrl.postArticleAddHandler)
//文章详情页路由 要根据文章id渲染 作者发布的文章
router.get('/article/info/:id', ctrl.getArticleInfoHandler)
//重新编辑文章页
router.get('/article/edit/:id', ctrl.getArticleEditHandler)
//点击编辑页面的保存按钮,保存编辑的文章,并渲染时间
router.post('/article/edit/:id', ctrl.postArticleEditHandler)

module.exports = router