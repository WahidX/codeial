const Post = require("../models/post");
const User = require("../models/users");
const Comment = require("../models/comment");
const Like = require("../models/like");
const queue = require("../config/kue");
const commentMailWorker = require("../workers/comment_mail_worker");


module.exports = {
    create : async function(req, res) {
        try{
            let post = await Post.findById(req.body.post);
            
            if(post){
                let comment = await Comment.create({
                    content: req.body.content,
                    user: req.user._id,
                    post: req.body.post
                });
                post.comments.push(comment);
                post.save();

                // if(req.xhr){
                //     // Only the user name we need n not the password, email 
                //     post = await post
                //         .populate({ path: 'user', select: 'name' })
                //         .populate({ path: 'comments', select: 'user' })
                //         .execPopulate();
                        
                                        
                //     return res.status(200).json({
                //         data: {
                //             post: post
                //         },
                //         message: 'Post created!'
                //     })
                // }

                comment = await comment.populate('user','name email').execPopulate();
                
                req.flash('success', 'Comment posted successfully!');
                


                // Mail notification
                // let job = queue.create('emails', comment).save(function(err){
                //     if(err){console.log("Err: ",err);return;}

                //     console.log(job.id);
                // });
                
                return res.redirect('/');    
            }
        } catch(err){
            console.log("Err: ",err);
        }
    },

    destroy : async function(req, res){
        try{
            let comment = await Comment.findById(req.params.id);

            if(comment.user = req.user.id){
                let postId = comment.post;
                comment.remove();

                let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id }});
                
                await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

                if(req.xhr){
                    return res.status(200).json({
                        data: {
                            comment_id: req.params.id
                        },
                        message: 'Post deleted'
                    });
                }
                
                req.flash('success', 'Comment deleted successfully!');
                return res.redirect('back');
            }
            else{
                req.flash('error', 'You cannot delete this comment!');
                res.redirect('back');
            }
        } catch(err){
            console.log("Err: ",err);
        }
    }
}
    
    
