const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


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


module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        console.log(req.params);
        console.log(post);
        if (post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post: req.params.id});    
            return res.status(200).json({
                message: "Post and associated comments deleted successfully!"
            });
        }else{
            return res.status(401).json({
                message: "You cannot delete this post!"
            });
        }

    }catch(err){
        console.log('********', err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }    
}
