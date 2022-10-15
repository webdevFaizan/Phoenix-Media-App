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

    return res.status(200).json({           //Whenever we are going to make an api versioning, then api needs to send the data in the form of json, since all the exchage now a days are done using json format of data. This is also good since this could be used to test the api using thunder client, since json format can be easily shown on thunder client api.
        message: "List of posts",
        posts: posts
    })
}