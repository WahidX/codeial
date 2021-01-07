const User = require('../../../models/users');
const Friendship = require('../../../models/friendship');

/*
  Friends = Followings
*/

module.exports.getFriends = async function (req, res) {
  if (req.user.following === 0) {
    return res.status(200).json({
      message: 'Successful',
      friends: [],
    });
  }

  let friendShips = await Friendship.find({
    from_user: req.user.id,
  })
    .select('to_user')
    .populate({
      path: 'to_user',
      select: '_id name email avatar bio following follower',
    });

  let friends = [];

  friendShips.map((friend) => {
    friends.push(friend.to_user);
  });

  return res.status(200).json({
    message: 'Request successful',
    friends,
  });
};

module.exports.addRemoveFriend = async function (req, res) {
  try {
    if (!req.query.id) {
      return res.status(404).json({
        message: 'Invalid request',
      });
    }
    let targetUser = await User.findById(req.query.id);
    let message;

    let existingFriendShip = await Friendship.findOne({
      from_user: req.user._id,
      to_user: req.query.id,
    });

    /*
      1. friendShip add del
      2. req.user.friends push pull
      3. follow counts for both
    */

    if (existingFriendShip) {
      existingFriendShip.remove();

      req.user.friends.pull(req.query.id);

      req.user.following--;
      targetUser.follower--;

      message = 'Unfollowed';
    } else {
      await Friendship.create({
        from_user: req.user._id,
        to_user: req.query.id,
      });

      req.user.friends.push(req.query.id);

      req.user.following++;
      targetUser.follower++;

      message = 'Followed';
    }

    req.user.save();
    targetUser.save();

    return res.status(200).json({
      message,
      req_user_following: req.user.following,
      target_user_follower: targetUser.follower,
    });
  } catch (err) {
    console.log('ERR: ', err);
    return res.status(501).json({
      message: 'Internal Server Error',
    });
  }
};
