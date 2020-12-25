const Friendship = require('../models/friendship');
const User = require('../models/users');
// const Post = require('../models/');
// const Comment = require('../models/comment');

module.exports.addRemove = async function (req, res) {
  try {
    let friend = true;

    // friend/add-remove/?id1=123&id2=321

    // Checking validity of the ids
    let user1 = await User.findById(req.query.id1);
    let targetUser = await User.findById(req.query.id2);
    if (req.user.id !== req.query.id1 || !targetUser) {
      req.flash('error', 'Invalid Request');
      console.log('IDs mismatch');

      return res.json(500, {
        message: 'Invalid Request',
      });
    }

    if (req.user.friends.indexOf(req.query.id2) !== -1) {
      // already friend
      await Friendship.deleteOne({
        from_user: req.user._id,
        to_user: req.query.id2,
      });
      req.user.friends.pull(req.query.id2);
      req.flash('success', 'Removed successfully');
      req.user.following--;
      req.user.save();

      targetUser.follower--;
      targetUser.save();
    } else {
      let newFriendShip = await Friendship.create({
        from_user: req.user._id,
        to_user: req.query.id2,
      });

      req.user.friends.push(req.query.id2);
      req.flash('success', 'Added successfully');
      req.user.following++;
      req.user.save();

      targetUser.follower++;
      targetUser.save();
    }

    return res.json(200, {
      message: 'Request successful',
      data: {
        friend: friend,
      },
    });
  } catch (err) {
    console.log('Err: ', err);
    return res.json(500, {
      message: 'Internal server error',
    });
  }
};
