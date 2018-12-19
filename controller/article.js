//添加页面处理逻辑代码

//获取处理发布时间
 const moment = require('moment')
//数据库
const mysql = require('mysql')
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog'
})
//转换md文档为html
//const marked = require('marked')

//markdown 编辑器插件 就是文本输入框
const mditor = require('mditor')
const parser = new mditor.Parser()

module.exports = {
  //到发表首页
    getArticleAddHandler(req, res) {
       // 未登录用户的拦截操作
      // 每一次请求都是独立的
      if (!req.session.isLogin) return res.redirect('/')
      res.render('article/add', {
        isLogin: req.session.isLogin,
        userInfo: req.session.userInfo
      })
    },
    //发表文章
    postArticleAddHandler(req,res){
      //session是的客户登录的时候储存的,所以后端验证是会挂载在req上
     // console.log(req.session.isLogin)
      //console.log(req.body)
      //用户没有登录或登录失效,返回信息让登录
     if(!req.session.isLogin) return res.status(401).send({status:'401',mse:'身份信息已过期!请登陆后重试!'})
      
      //将前端传送来的数据复制给articleInfo 以便凭借时间
      const articleInfo =req.body
      articleInfo.ctim = moment().format('YYYY-MM-DD HH:mm:ss')
      articleInfo.author_id = req.session.userInfo.id
      const sql = 'insert into articles set?'
      conn.query(sql ,articleInfo,(err,result)=>{
         // console.log(result)  result对象里包含 affectedRows当等于1时发表成功
         if (err || result.affectedRows !== 1) return res.status(500).send({ status: 500, msg: '文章发表失败!请重试!' + err.message })//发表失败
            // 还需要将刚插入数据库的那条数据ID也一起返回
          res.send({ status: 200, msg: '文章发表成功!', articleId: result.insertId })
        
        })
      
    },
    //渲染作者发布的文章列表
    getArticleInfoHandler(req,res){
      //接收文章id
      const  articleId = parseInt(req.params.id)
      //根据ID查询数据库 获取文章详情
      const asql = "select * from articles where id = ?"
      conn.query(asql,articleId,(err,result)=>{
        if (err || result.length !== 1) return res.redirect('/')
        //console.log(result)
        // render和send的是使用时机
      // 当用户使用get请求访问服务器并且需要看到页面时 应该用render渲染
      // 当用户使用ajax请求访问服务器 并且需要获取数据时  应该用send返回数据
      // res.send(result) 
      //parser.parse()将md文章文件转换成html
      //result[0].content = parser.parse(result[0].content)
        res.render('article/info',{
          isLogin: req.session.isLogin,
          userInfo: req.session.userInfo,
          articleInfo: result[0]
        })
      })
    
    
    },
    //编辑文章
    getArticleEditHandler(req,res){
        // 如果只做登录校验是不严谨的
    // 应该加上作者的校验
    if (!req.session.isLogin) return res.redirect('/')
      //接收文章id
      const  articleId = parseInt(req.params.id)
      //根据ID查询数据库 获取文章详情
      const asql = "select * from articles where id = ?"
      conn.query(asql,articleId,(err,result)=>{
        if (err || result.length !== 1) return res.redirect('/')
        //console.log(result)
        //权限控制:如果当前登录的ID与作者ID不匹配 也不能渲染
        if(req.session.userInfo.id != result[0].author_id) return res.redirect('/')
      //result[0].content = parser.parse(result[0].content)
        res.render('article/edit',{
          isLogin: req.session.isLogin,
          userInfo: req.session.userInfo,
          articleInfo: result[0]
        })
      })
    },
    postArticleEditHandler(req,res){
      req.body.ctim = moment().format('YYYY-MM-DD HH:mm:ss')
      //console.log(req.body)
      console.log(req.params.id)
       conn.query('update articles set ? where id = ?',[req.body, req.params.id],(err, result) => {
        console.log(result)
         if (err || result.affectedRows !== 1) return res.status(500).send({status: 500, msg:'文章修改失败,请重试!'+err.message})
        res.send({status: 200, msg: '文章修改成功!'})
      })
    }
  }