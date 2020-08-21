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
            await Post.create({
                content: req.body.content,
                user: req.user._id
            });
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
                return res.redirect('back');
            }
        } catch(err) {
            console.log('Err: ',err);
        }
    }



}