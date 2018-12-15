//后端服务器端处理

//引入express
const express= require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')
//注册服务器
const app = express()
//静态资源托管 
app.use('/views',express.static('./views'))
app.use('/node_modules',express.static('./node_modules'))
//使用模板引擎
app.set('view engine', 'ejs')
app.set('views', './views') // 设置存放路径


const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'blog'
})
//导入body-parser 用于获取表单提交的数据

app.use(bodyParser.urlencoded({ extended: false }))




//处理逻辑中间件
    //客户端访问根目录时返回主页面
    app.get('/',(req,res)=>{
        res.render('index',{})
    })

    //登录页面
    app.get('/login',(req,res)=>{
        res.render('./user/login.ejs',{})
    })
    //注册页面
    app.get('/register',(req,res)=>{
        res.render('./user/register.ejs',{})
    })

    //注册页面
    app.post('/register',(req,res)=>{
        //取消浏览器默认样式
        let userInfo = req.body
         // 1. 表单校验
        if (!userInfo.username || !userInfo.nickname || !userInfo.password) return res.status(400).send({ status: 400, msg: '请输入正确的表单信息!' })
        // 2. 查重  判断用户名是否已经存在  连接数据库查询
            const chachongSql = 'select count(*) as count from user where username = ?'
            conn.query(chachongSql, userInfo.username, (err, result) => {
            if(result[0].count !==0) return res.status(400).send({ status: 400, msg: '用户名重复!请重试!' })
            userInfo.ctim = moment().format('YYYY-MM-DD HH:mm:ss')
            console.log( userInfo)
            const addsql = 'insert into user set ?'    
            conn.query(addsql,userInfo,(err,result)=>{
                console.log(err.message)
                //注册成功就想客户端请求的ajax返回注册成功信息,失败就返回失败信息
                if(err) return res.status(500).send({ status: 500, msg: '注册失败!请重试!' })
                    res.send({ status: 200, msg: '注册成功!' })
            })
            })
    })


    //登录页面
    app.post('/login',(req,res)=>{
        const selemsq = "select * from user where username = ? and password = ?"
        conn.query(selemsq,[req.body.username,req.body.password],(err,result)=>{
            console.log(result)
            if(result.length === 0 || err) return res.status(400).send({ status: 400, msg: '登录失败!请重试!' })
                 // 登录成功
                res.send({ status: 200, msg: '登录成功!' })
        })
    })








//开启服务器
app.listen(5050,()=>{
    console.log('http://127.0.0.1:5050')
})