const Post=require('../models/Post')

exports.createpost= function(req,res){
res.render('create-post')
}

exports.create = function(req, res) {

    let post = new Post(req.body, req.session.user._id)
    post.create().then(function(newId) {
      
      req.flash("success", "New post successfully created.")
      req.session.save(() => res.redirect(`/post/${newId}`))
    }).catch(function(errors) {
      errors.forEach(error => req.flash("errors", error))
      req.session.save(() => res.redirect("/create-post"))
    })
  }

  exports.viewSingle =async function(req, res) {
    try {
      
      let post =await Post.findSingleById(req.params.id,req.visitorId)
      res.render('single-post-screen', {post: post})
    } catch {
      res.render('404')
    }
  }

// to edit post 
  exports.viewEditPost =async function(req, res) {
    try {
      let post = await Post.findSingleById(req.params.id, req.visitorId)
      if (post.isVisitorOwner) {
        res.render("edit-post-screen", {post: post})
      } else {
        req.flash("errors", "You do not have permission to perform that action.")
        req.session.save(() => res.redirect("/"))
      }
    } catch {
      res.render("404")
    }
  }
  // to save edited post 
  exports.updateEditedPost =async function(req, res) {
    let post = new Post(req.body, req.visitorId, req.params.id)
  post.Update().then((status) => {
    // the post was successfully updated in the database
    // or user did have permission, but there were validation errors
    if (status == "success") {
      // post was updated in db
      req.flash("success", "Post successfully updated.")
      req.session.save(function() {
        res.redirect(`/post/edit/${req.params.id}`)
      })
    } else {
      post.errors.forEach(function(error) {
        req.flash("errors", error)
      })
      req.session.save(function() {
        res.redirect(`/post/edit/${req.params.id}`)
      })
    }
  }).catch(() => {
    // a post with the requested id doesn't exist
    // or if the current visitor is not the owner of the requested post
    req.flash("errors", "You do not have permission to perform that action.")
    req.session.save(function() {
      res.redirect("/")
    })
  })
}

//To Delete Post By Id
exports.deletePost = function(req, res){
  Post.delete(req.params.id, req.visitorId).then(() => {
    req.flash("success", "Post successfully deleted.")
    req.session.save(() => res.redirect(`/profile/${req.session.user.username}`))
  }).catch(() => {
    req.flash("errors", "You do not have permission to perform that action.")
    req.session.save(() => res.redirect("/"))
  })
}