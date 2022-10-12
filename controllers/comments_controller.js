const Comment = require('../models/comment');
const Post = require('../models/post')

module.exports.create = function(req,res){
    //IMPORTANT : The findById mehtod is important, since the id of the post might be hidden for viewing but it is still visible in the html file, and any one can manipulate the data from there, so instead we will put a check on the back end itself, so here first we will find the Post by the given id and then we will put the comment on that post. This is why having a check from the back end is so necessary.
    Post.findById(req.body.post, function(err, post){     //Since there would be a lot of posts that would be in the db, so we first need to find it by the post and then we need to push the comment that we have newly created into the comments array. But this will be done with the help of a hidden input element 'post' that will be added in the form.
        if(err){console.log(err);return;}    
        if(post){
            Comment.create({
                content : req.body.content,
                user : req.user._id,        //We need to keep the userId that posted the comment. But here too req.user.password is accessible which should have not been accessible, and I have explained how we could solve this in the posts_controller.js create method comment, just read it from there.
                post : req.body.post      //We need to keep track of postId on which the comment has been made.
            },function(err,comment){
                if(err){console.log(err);return;}    
                    post.comments.push(comment);    //After the comment is successfully created and updated in its own database, we will update the comments in the post's array, which means we are updating and we have a slight different syntax for the updation.
                    post.save();            //IMPORTANT : Whenever we are updating any thing, we need to save it. This method tells the database that for now this is the final version, and we need to block it.
                return res.redirect('/');
            });
        }
    });    
}