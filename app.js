const express=require('express')
const app=express()
// To include markdown tags in your body post
const markdown = require('marked')
const sanitizeHTML = require('sanitize-html')
const session = require('express-session')
//refrencing mongo session
const MongoStore=require('connect-mongo')(session)
//to add flash msgs
const flash=require('connect-flash')

//bydefaut below data will add session data in memory but by adding store it can store in db
let sessionOptions=session({
    secret:"Javascript is cool",
    store:new MongoStore({client: require('./db')}),
    resave:false,
    saveUninitialized: false,
    cookie:{maxAge:1000*60*60*24,httpOnly:true}
})

app.use(sessionOptions)
app.use(flash())
//to make session object globally available
//run this for every request and run before router
//obj available on ejs locally     
    //obj available on ejs locally
  //obj available on ejs locally     

  app.use(function(req, res, next) {
    // make our markdown function available from within ejs templates
  res.locals.filterUserHTML = function(content) {
    return sanitizeHTML(markdown(content), {allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], allowedAttributes: {}})
  }
    // make all error and success flash messages available from all templates
  res.locals.errors = req.flash("errors")
  res.locals.success = req.flash("success")
    // make current user id available on the req object
    if (req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}
    
    // make user session data available from within view templates
    res.locals.user = req.session.user
    next()
  })


//to define router variable to call router file in current folder
const router=require('./router')
//to accept input from browser as request.body
app.use(express.urlencoded({extended: false}))
app.use(express.json())


//To set view to our view folder
app.set('views','views')
//To set EJS as our vieww engine
app.set('view engine','ejs')
//To tell express server to make this folder as public
app.use(express.static('public'))

//To use router variable data to open this url
app.use('/',router)
module.exports = app