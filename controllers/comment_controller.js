const Post = require("../models/post");
const User = require("../models/users");
const Comment = require("../models/comment");


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
                req.flash('success', 'Comment posted successfully!');
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
    
    
