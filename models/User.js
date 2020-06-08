//to get hashing pkg
const bcrypt=require('bcryptjs')
//to get db object from export and add users collection link
const usersCollection = require('../db').db().collection("users")
//to run validator properties
const validator = require("validator")

const md5=require('md5')

let User = function(data,getAvatar) {
  this.data = data
  this.errors = []
  if (getAvatar == undefined) {getAvatar = false}
  if (getAvatar) {this.getAvatar()}
}

User.prototype.cleanUp = function() {
  if (typeof(this.data.username) != "string") {this.data.username = ""}
  if (typeof(this.data.email) != "string") {this.data.email = ""}
  if (typeof(this.data.password) != "string") {this.data.password = ""}

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

User.prototype.validate = function() {
  if (this.data.username == "") {this.errors.push("You must provide a username.")}
  if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
  if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
  if (this.data.password == "") {this.errors.push("You must provide a password.")}
  if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters.")}
  if (this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters.")}
  if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters.")}
  if (this.data.username.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}
}

User.prototype.login = function() {
  return new Promise((resolve,reject)=>{
    //to check values are string of text
  this.cleanUp()
  usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
    if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
     this.data=attemptedUser 
      this.getAvatar()
     
      resolve("Congrats!")
    } else {
      reject("Invalid username / password.")
    }
  }).catch(function() {
    reject("Please try again later.")
  })
})
}
User.prototype.register = function() {
  // Step #1: Validate user data
  this.cleanUp()
  this.validate()

  // Step #2: Only if there are no validation errors 
  // then save the user data into a database
  if (!this.errors.length) {
    // hash user password
    let salt = bcrypt.genSaltSync(10)
    this.data.password = bcrypt.hashSync(this.data.password, salt)
     usersCollection.insertOne(this.data)
     this.getAvatar()
  }
}

User.prototype.getAvatar=function(){
  this.avatar=`https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

User.findByUsername = function(username) {
  return new Promise(function(resolve, reject) {
    if (typeof(username) != "string") {
      reject()
      return
    }
    usersCollection.findOne({username: username}).then(function(userDoc) {
      if (userDoc) {
        userDoc = new User(userDoc, true)
        userDoc = {
          _id: userDoc.data._id,
          username: userDoc.data.username,
          avatar: userDoc.avatar
        }
        resolve(userDoc)
      } else {
        reject()
      }
    }).catch(function() {
      reject()
    })
  })
}


module.exports = User