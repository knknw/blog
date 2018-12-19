//抽取出的 业务处理逻辑代码
module.exports={
    getIndexHandler(req,res){
        res.render('index',{
            userInfo: req.session.userInfo,
            isLogin: req.session.isLogin
         })
    }
}