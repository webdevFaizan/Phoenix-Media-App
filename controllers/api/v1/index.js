const Post = require('../../../models/post');
// const Comment = require('../../../models/comment');
module.exports.index = async function(req, res){

    let posts = await Post.find({})
        // .select('-password')
        .sort('-createdAt')
        .populate('user','-password')       //IMPORTANT : This population function will populate the user but leave password field behind, this is always useful since we do not want password to be reutrned to any one, it is there for authentication purposes only.
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

    return res.status(200).json({
        message: "List of posts",
        posts: posts
    })
}