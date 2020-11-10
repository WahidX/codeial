const { model } = require('../models/friendship');
const friendship = require('../models/friendship');
const Like = require('../models/friendship');
// const Post = require('../models/');
// const Comment = require('../models/comment');

module.exports.addRemove = async function(req, res){
    try{
        let friend = true;

        // friend/add-remove/?id1=123&id2=321
        console.log("id1 = ",req.query.id1, "id2 = ",req.query.id2);        

        // TODO:
        // check if there's any friendship exists
        // add or remove friend accordingly
        // also update friend array in users model
        // send var friend true or false

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