const User = require('../models/User')
exports.login=function(req,res)
{
let user=new User(req.body)
user.login().then(function(result){
  //creating new session object unique per browser visit
  req.session.user={avatar:user.avatar,username: user.data.username}
//now we need to redirect to home page but we need to check timing with above session, so sessesion auto save but in order to sync we are saving 
  req.session.save(function(){
    res.redirect('/')
  })//saving new data to db and then call func

}).catch(function(e){
 req.flash('errors',e)
 req.session.save(function(){
   res.redirect('/')
 })
})
}

exports.logout=function(req,res)
{
  //if current req from browser has a session with valid id and cookie so it willfind out and sestroy
  req.session.destroy(function(){
    res.redirect('/')
  })
    
}
exports.register=function(req,res)
{
    let user = new User(req.body)
    user.register()
    if (user.errors.length) {
      user.errors.forEach(function(error){
        //creating new flash parameter for egistration errors
req.flash('regErrors',error)

      })
      //for timimg calling save manually
      req.session.save(function(){
        res.redirect('/')
      })
    } else {
      res.send("Congrats, there are no errors.")
    }
    
}
exports.mustbeloggedin=function(req,res,next){
  if(req.session.user)
  {
  next()
}else{
  req.flash("errors","You must logged in to perform that action!!")
  req.session.save(function(){
    res.redirect('/')
  })
}
}

exports.home= function(req,res){
       
  if(req.session.user)
  {
    //render to home page and make property to send user name from session
    res.render('home-dashboard')

  }else{
    res.render('home-guest',{errors: req.flash('errors'),regErrors: req.flash('regErrors')})
  }
        } 
