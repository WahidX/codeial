const User = require('../../../models/users');
const Friendship = require('../../../models/friendship');

module.exports.getFriends = async function (req, res) {
  if (req.user.following === 0) {
    return res.status(200).json({
      message: 'Successful',
      friends: [],
    });
  }

  let user = await User.findById(req.user.id).populate({
    path: 'friends',
    select: '_id name email avatar follower following',
  });

  return res.status(200).json({
    message: 'Reqest successful',
    friends: user.friends,
  });
};

module.exports.addRemoveFriend = async function (req, res) {
  try {
    if (!req.query.id) {
      return res.status(404).json({
        message: 'Invalid request',
      });
    }

    let existingFriendShip = await Friendship.findOne({
      from_user: req.user._id,
      to_user: req.query.id,
    });

    let message;

    let targetUser = await User.findById(req.query.id);

    if (req.user.friends.indexOf(req.query.id) !== -1) {
      // already friend
      await Friendship.deleteOne({
        from_user: req.user._id,
        to_user: req.query.id,
      });
      req.user.friends.pull(req.query.id);
      message = 'Removed successfully';
      req.user.following++;

      targetUser.follower++;
      targetUser.save();
    } else {
      let newFriendShip = await Friendship.create({
        from_user: req.user._id,
        to_user: req.query.id,
      });
      req.user.friends.push(req.query.id);
      message = 'Added successfully';
      req.user.following--;

      targetUser.follower--;
      targetUser.save();
    }

    req.user.save();

    return res.status(200).json({
      message,
    });
  } catch (err) {
    console.log('ERR: ', err);
    return res.status(501).json({
      message: 'Internal Server Error',
    });
  }
};
