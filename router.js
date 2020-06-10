const express=require('express')
const router=express.Router()
//to require user controller in variable
const usercontroller=require('./controller/userController')
const postcontroller=require('./controller/postcontroller')

//request for usercontroller
//calling Register function
router.get('/',usercontroller.home)
router.post('/register',usercontroller.register)
router.post('/login',usercontroller.login)
router.post('/logout',usercontroller.logout)

// profile related routes
router.get('/profile/:username',usercontroller.ifUserExists, usercontroller.profilePostsScreen)

//post request for postcontroller
router.get('/create-post',usercontroller.mustbeloggedin,postcontroller.createpost)
router.post('/create-post',usercontroller.mustbeloggedin,postcontroller.create)
router.get('/post/:id',postcontroller.viewSingle)
router.get('/post/edit/:id',postcontroller.viewEditPost)
router.post('/post/edit/:id',usercontroller.mustbeloggedin,postcontroller.updateEditedPost)
router.post('/post/delete/:id',usercontroller.mustbeloggedin,postcontroller.deletePost)
module.exports=router