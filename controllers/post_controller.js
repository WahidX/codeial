const Post = require("../models/post");
const User = require("../models/users");


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
    }



}