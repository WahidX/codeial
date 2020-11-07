const { populate } = require("../models/post");
const Post = require("../models/post");
const User = require("../models/users");

module.exports = {
    home : async function(req, res) {
        
        try{

            let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },  // Next populate giving error
                populate: {
                    path: 'likes'
                }
            }).populate('likes');
            
            let users = await User.find({});

            console.log(posts[0]);

            return res.render('home', {
                title: "Home",
                posts: posts,
                all_users: users
            });


        }
        catch(err){
            console.log('Err in home function',err);
            return;
        }

    }

};

