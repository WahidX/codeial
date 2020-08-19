const Post = require("../models/post");
const User = require("../models/users");
const Comment = require("../models/comment");

module.exports = {
    createPost : function(req, res){
        // Need to authenticate before posting
        if(!req.isAuthenticated()){
            return res.redirect('/user/login');
        }

        Post.create({
            content: req.body.content,
            user: req.user._id
        }, function(err, post){
            if(err){
                console.log("Err in ceating post in mongoDB", err);
                return;
            }

            return res.redirect('back');
        });
    },

    destroy: function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err){console.log("err in finding post by ID", err); return;}

            if(post && post.user == req.user.id){
                post.remove();
            
                Comment.deleteMany({post: req.params.id}, function(err){
                    return res.redirect("back");
                });
            }
        });
    }



}