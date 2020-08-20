const Post = require("../models/post");
const User = require("../models/users");

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
            if(err){console.log('Err in getting all the posts',err);return;}

            User.find({}, function(err, users){
                if(err){console.log('Err in getting all the posts',err);return;}

                return res.render('home', {
                    title: "Home",
                    posts: posts,
                    all_users: users
                });                
            });
        });
    }

    
    
    

};

