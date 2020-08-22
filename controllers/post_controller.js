const Post = require("../models/post");
const User = require("../models/users");
const Comment = require("../models/comment");

module.exports = {
    createPost : async function(req, res){
        // Need to authenticate before posting
        if(!req.isAuthenticated()){
            return res.redirect('/user/login');
        }
        try{
            let post = await Post.create({
                content: req.body.content,
                user: req.user._id
            });

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: 'Post created successfully!!!'
                })
            }

            req.flash('success', 'Posted created successfully!');
            return res.redirect('back');    

        } catch(err) {
            console.log('Err in create func: ',err);
            return;
        }
    },

    destroy: async function(req, res){
        try{
            let post = await Post.findById(req.params.id);

            if(post && post.user == req.user.id){
                post.remove();
        
                await Comment.deleteMany({post: req.params.id});
                req.flash('success', 'Post deleted successfully!');
                return res.redirect('back');
            }
            else{
                req.flash('error', 'You cannot delete this post!');
            }
        } catch(err) {
            console.log('Err: ',err);
        }
    }



}