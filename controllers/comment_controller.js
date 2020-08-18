const Post = require("../models/post");
const User = require("../models/users");
const Comment = require("../models/comment");


module.exports = {
    create : function(req, res) {
        Post.findById(req.body.post, function(err, post){
            if(err){console.log("err in finding post for commenting",err); return;}

            if(post){
                Comment.create({
                    content: req.body.content,
                    user: req.user._id,
                    post: req.body.post
                }, function(err, comment){
                    if(err){console.log('err in creating comment',err); return;}

                    post.comments.push(comment);
                    post.save();

                    return res.redirect('/');
                });
            }
        });
    }
}
    
    
