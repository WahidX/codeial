const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    });

  return res.json(200, {
    message: 'List X',
    posts: posts,
  });
};

module.exports.createPost = async function (req, res) {
  if (
    !req.body.content ||
    req.body.content.length === 0 ||
    req.body.content.length > 300
  ) {
    return res.status(404).json({
      message: 'Invalid Content',
    });
  }

  try {
    let newPost = await Post.create({
      content: req.body.content,
      user: req.user.id,
    });

    return res.status(200).json({
      message: 'post created successfully!',
      data: {
        post: newPost,
      },
    });
  } catch (err) {
    console.error(err);
    return res.send('Internal Error');
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    if (post && post.user == req.user.id) {
      post.remove();

      await Comment.deleteMany({ post: req.params.id });

      return res.json(200, {
        message: 'Post and associated comments are deleted',
      });
    } else {
      return res.json(401, {
        message: "You're not authorized to do this.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.json(500, {
      message: 'Internal Server error',
    });
  }
};
