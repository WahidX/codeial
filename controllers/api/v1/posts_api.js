const Post = require('../../../models/post');

module.exports.index = async function(req, res){
    
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    return res.json(200, {
        message: 'List X',
        posts: posts
    })
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        if(post && post.user == req.user.id){
            post.remove();
    
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                console.log('xhr Gotten');
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'Post deleted successfully'
                })
            }

            req.flash('success', 'Post deleted successfully!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'You cannot delete this post!');
        }
    } catch(err) {
        console.log('Err: ',err);
    }
}