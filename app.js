//后端服务器端处理

//引入express
const express= require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

//注册服务器
const app = express()
//开启session储存的
app.use(session({
    secret: 'keyboard cat', //sessionID用于浏览器与服务器对比的
    resave: false,
    saveUninitialized: true,
    // 如果不设置过期时间  默认 关闭浏览器即过期, 无法存储有效的cookie
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
  }))
  
//静态资源托管 
app.use('/views',express.static('./views'))
app.use('/node_modules',express.static('./node_modules'))

//使用模板引擎
app.set('view engine', 'ejs')
app.set('views', './views') // 设置存放路径

//导入body-parser 用于获取表单提交的数据
app.use(bodyParser.urlencoded({ extended: false }))

//处理逻辑中间件
    //客户端访问根目录时返回主页面
    //引入主页路由
    app.use(require('./routes/index'))
    //登录页面  //注册页面
    app.use(require('./routes/user'))
    //发布文章页面  //文章详情页
    app.use(require('./routes/article'))
   
    


//开启服务器
app.listen(5050,()=>{
    console.log('http://127.0.0.1:5050')
})