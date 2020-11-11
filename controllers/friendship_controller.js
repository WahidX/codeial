const Friendship = require('../models/friendship');
const User = require('../models/users');
// const Post = require('../models/');
// const Comment = require('../models/comment');

module.exports.addRemove = async function(req, res){
    try{
        let friend = true;

        // friend/add-remove/?id1=123&id2=321  

        // Checking validity of the ids
        let user1 = await User.findById(req.query.id1);
        let user2 = await User.findById(req.query.id2);
        if( req.user.id !== req.query.id1 || !user2 ){
            req.flash('error', 'Invalid Request');
            console.log("IDs mismatch");

            return res.json(500, {
                message: "Invalid Request"
            });
        }
        
        let match1, match2;
        
        match1 = await Friendship.find({ from_user: req.query.id1, to_user: req.query.id2 });
        
        if (match1.length === 0){
            match2 = await Friendship.find({ from_user: req.query.id2, to_user: req.query.id1 });
        }


        if (match1.length > 0 || match2.length > 0){
            //remove
            if(match1.length > 0){
                await Friendship.deleteOne({ from_user: req.query.id1, to_user: req.query.id2 });
            }
            else{
                await Friendship.deleteOne({ from_user: req.query.id2, to_user: req.query.id1 });
            }

            user1.friends.pull( user2._id );
            user1.save();
            user2.friends.pull( user1._id );
            user2.save();

            friend = false;
        }
        else{
            //add 
            await Friendship.create({
                from_user: req.query.id1,
                to_user: req.query.id2
            });

            user1.friends.push(user2._id);
            user1.save();
            user2.friends.push(user1._id);
            user2.save();

        }


        return res.json(200, {
            message: "Request successful",
            data: {
                friend: friend
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