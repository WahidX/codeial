const User = require('../../../models/users');
const Post = require('../../../models/post');

module.exports.generalSearch = async function (req, res) {
  if (!req.query.key || !req.query.type) {
    return res.status(404).json({
      message: 'Search something',
    });
  }
  let results_post, results_user;
  try {
    if (req.query.type === 'user') {
      results_user = await User.find({
        name: { $regex: req.query.key },
      })
        .select('_id name avatar')
        .sort('-createdAt');
    } else if (req.query.type === 'post') {
      results_post = await Post.find({
        content: { $regex: req.query.key },
      })
        .select('_id content user')
        .populate({
          path: 'user',
          select: '_id name avatar',
        })
        .sort('-createdAt');
    } else {
      results_user = await User.find({
        name: { $regex: req.query.key },
      })
        .select('_id name avatar')
        .sort('-createdAt');

      results_post = await Post.find({
        content: { $regex: req.query.key },
      })
        .select('_id content user')
        .populate({
          path: 'user',
          select: '_id name avatar',
        })
        .sort('-createdAt');
    }

    return res.status(200).json({
      message: 'success',
      results_post,
      results_user,
    });
  } catch (err) {
    console.error(err);
    return res.status(404).json({
      message: err,
    });
  }
};
