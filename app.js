const express=require('express')
const app=express()


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
app.use(function(req,res,next){
    //obj available on ejs locally
res.locals.user=req.session.user
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