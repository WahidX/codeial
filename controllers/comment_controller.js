const Post = require("../models/post");
const User = require("../models/users");
const Comment = require("../models/comment");


module.exports = {
    createComment : function(req, res) {
        
        Comment.find({}).populate('user').populate('comment').exec(function(err, comments){
            if(err){
                console.log('Err in getting all the posts',err);
            }

            return res.render('home', {
                title: "Home",
                posts: posts
            });
        });

    }
    
    

};

