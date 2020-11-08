const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try{
        let likeable;
        let deleted = false;
        // likes/toggle/?id=123&type=asd
        
        if (req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // Check if like already there or not
        let existingLike = await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type
        });

        if(existingLike){   // remove like
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            
            deleted = true;
        }
        else{               // adding like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.json(200, {
            message: "Request successful",
            data: {
                deleted: deleted
            }
        });

    }
    catch(err){
        console.log("Err: ",err);
        return res.json(500, {
            message: "Internal server error"
        });
    }
}