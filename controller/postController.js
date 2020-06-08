const Post=require('../models/Post')

exports.createpost= function(req,res){
res.render('create-post')
}

exports.create = function(req, res) {
  console.log()
    let post = new Post(req.body, req.session.user._id)
    post.create().then(function() {
      res.send("New post created.")
    }).catch(function(errors) {
      res.send(errors)
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