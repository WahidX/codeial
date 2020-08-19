const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports = {
    home : function(req, res) {
        
        Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec(function(err, posts){
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

