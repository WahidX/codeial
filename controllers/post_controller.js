const Post = require("../models/post");
const User = require("../models/users");
const Comment = require("../models/comment");
const Like = require("../models/like");

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
                // Only the user name we need n not the password, email 
                post = await post.populate('user', 'name').execPopulate();

                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: 'Post created!'
                })
            }

            req.flash('success', 'Posted created successfully!');
            return res.redirect('back');    

        } catch(err) {
            req.flash('error', 'err');
            console.log('Err in create func: ',err);
            return;
        }
    },

    destroy: async function(req, res){
        try{
            let post = await Post.findById(req.params.id);

            if(post && post.user == req.user.id){
                // Delete likes associated with the post and its comments
                await Like.deleteMany({likeable: post, onModel: 'Post'});
                await Like.deleteMany({_id: { $in: post.comments}});

                post.remove();
        
                await Comment.deleteMany({post: req.params.id});

                if(req.xhr){
                    console.log('xhr Gotten');
                    return res.status(200).json({
                        data: {
                            post_id: req.params.id
                        },
                        message: 'Post deleted successfully'
                    })
                }

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