const Comment = require('../models/comment');

module.exports.create = function(req,res){
    Post.findById(req.body.postId, function(err, post){     //Since there would be a lot of posts that would be in the db, so we first need to find it by the postId and then we need to push the comment that we have newly created into the comments array.
        if(err){console.log(err);return;}    
        if(post){
            Comment.create({
                content : req.body.comment,
                user : req.user._id,        //We need to keep the userId that posted the comment. But here too req.user.password is accessible which should have not been accessible, and I have explained how we could solve this in the posts_controller.js create method comment, just read it from there.
                post : req.body.postId      //We need to keep track of postId on which the comment has been made.
            },function(err,comment){
                if(err){console.log(err);return;}    
                    post.comments.push(comment);
                    post.save();            //IMPORTANT : Whenever we are updating any thing, we need to save it. This method tells the database that for now this is the final version, and we need to block it.
                return res.redirect('/');
            });
        }
    });    
}