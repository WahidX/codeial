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
                populate: {     // user not populating
                    path: 'user'
                },  
                populate: {
                    path: 'likes'
                }
            }).populate('likes');
            
            let users = await User.find({});

            // friends
            let friends;
            if (req.user){
                let current_user = await User.findById(req.user.id).populate({
                    path: 'friends',
                    populate: {
                        path: 'user'
                    }
                })
                friends = current_user.friends;
            }else{
                friends = [];
            }
            

            return res.render('home', {
                title: "Home",
                posts: posts,
                friends: friends,
                all_users: users
            });


        }
        catch(err){
            console.log('Err in home function',err);
            return;
        }

    }

};

