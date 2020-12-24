const User = require('../../../models/users');
const Friendship = require('../../../models/friendship');

module.exports.getFriends = async function (req, res) {
  let friends = await Friendship.find({
    from_user: req.user._id,
  });

  return res.status(200).json({
    message: 'Reqest successful',
    data: {
      friends,
    },
  });
};

module.exports.addRemoveFriend = async function (req, res) {
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
  if (req.user.friends.indexOf(req.query.id) !== -1) {
    // already friend
    await Friendship.deleteOne({
      from_user: req.user._id,
      to_user: req.query.id,
    });
    req.user.friends.pull(req.query.id);
    message = 'Removed successfully';
  } else {
    let newFriendShip = await Friendship.create({
      from_user: req.user._id,
      to_user: req.query.id,
    });
    req.user.friends.push(req.query.id);
    message = 'Added successfully';
  }

  await req.user.save();

  return res.status(200).json({
    message,
  });
};
