//登录与注册处理代码

const mysql = require('mysql')
const moment = require('moment')
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog'
})

module.exports = {
    //注册页面
    getRegisterHandler(req, res){
        res.render('./user/register.ejs', {})
    },
    //注册申请
    postRegisterHandler (req, res){
        //取消浏览器默认样式
        let userInfo = req.body
        // 1. 表单校验
        if (!userInfo.username || !userInfo.nickname || !userInfo.password) return res.status(400).send({
            status: 400,
            msg: '请输入正确的表单信息!'
        })
        // 2. 查重  判断用户名是否已经存在  连接数据库查询
        const chachongSql = 'select count(*) as count from user where username = ?'
        conn.query(chachongSql, userInfo.username, (err, result) => {
            if (result[0].count !== 0) return res.status(400).send({
                status: 400,
                msg: '用户名重复!请重试!'
            })
            userInfo.ctim = moment().format('YYYY-MM-DD HH:mm:ss')
            console.log(userInfo)
            const addsql = 'insert into user set ?'
            conn.query(addsql, userInfo, (err, result) => {
                //console.log(err)
                //注册成功就想客户端请求的ajax返回注册成功信息,失败就返回失败信息
                if (err) return res.status(500).send({
                    status: 500,
                    msg: '注册失败!请重试!'
                })
                res.send({
                    status: 200,
                    msg: '注册成功!'
                })
            })
        })
    },
    //登录
    getLoginHandler(req, res) {
        res.render('./user/login.ejs', {})
    },
    //登录申请
    postLoginHandler(req, res){
        //console.log(req.body)
        const selemsq = "select * from user where username = ? and password = ?"
        conn.query(selemsq, [req.body.username, req.body.password], (err, result) => {
            //console.log(result)
            if (result.length === 0 || err) return res.status(400).send({status: 400,msg: '登录失败!请重试!'})
            // 登录成功 
            //将用户登录信息储存到session中
            req.session.userInfo = result[0] //相当于设置session 储存的userInfo=result[0]
            // 记录登录状态
            req.session.isLogin = true //true就是已经登录,用于做登录拦截,用户登录了就能访问首页
                                    //的文章,没有登录就不能看到
            //console.log(req.session)

            res.send({
                status: 200,
                msg: '登录成功!'
            })
         })
    },
    //退出登录
    getLogoutHandler(req,res){
        req.session.destroy((err)=>{
            // 在这里不能访问session了  已经销毁完成了
        res.send({status: 200, msg: '退出登录成功!'})
        })
    }




}