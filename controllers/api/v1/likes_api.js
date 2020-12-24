const Post = require('../../../models/post');
const Like = require('../../../models/like');

module.exports.toggleLike = async function (req, res) {
  try {
    let likeable;
    // likes/toggle/?id=123&type=asd

    if (req.query.type == 'Post') {
      likeable = await Post.findById(req.query.id);
    } else {
      likeable = await Comment.findById(req.query.id);
    }
    let message;

    // Check if already liked or not
    if (likeable.likes.indexOf(req.user._id) === -1) {
      // no existing like
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });
      likeable.likes.push(req.user._id);
      message = 'Liked';
    } else {
      // already liked
      await Like.deleteOne({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });
      likeable.likes.pull(req.user._id);
      message = 'Unliked';
    }

    await likeable.save();

    return res.status(200).json({
      message,
    });
  } catch (err) {
    console.log('Err: ', err);
    return res.json(500, {
      message: 'Internal server error',
    });
  }
};
