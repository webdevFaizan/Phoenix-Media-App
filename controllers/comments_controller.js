const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');

const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');


// Method 1 - Synchronous code.
// module.exports.create = function(req,res){
//     //IMPORTANT : The findById mehtod is important, since the id of the post might be hidden for viewing but it is still visible in the html file, and any one can manipulate the data from there, so instead we will put a check on the back end itself, so here first we will find the Post by the given id and then we will put the comment on that post. This is why having a check from the back end is so necessary.
//     Post.findById(req.body.post, function(err, post){     //Since there would be a lot of posts that would be in the db, so we first need to find it by the post and then we need to push the comment that we have newly created into the comments array. But this will be done with the help of a hidden input element 'post' that will be added in the form.
//         if(err){console.log(err);return;}    
//         if(post){
//             Comment.create({
//                 content : req.body.content,
//                 user : req.user._id,        //We need to keep the userId that posted the comment. But here too req.user.password is accessible which should have not been accessible, and I have explained how we could solve this in the posts_controller.js create method comment, just read it from there.
//                 post : req.body.post      //We need to keep track of postId on which the comment has been made.
//             },function(err,comment){
//                 if(err){console.log(err);return;}    
//                     post.comments.push(comment);    //After the comment is successfully created and updated in its own database, we will update the comments in the post's array, which means we are updating and we have a slight different syntax for the updation.
//                     post.save();            //IMPORTANT : Whenever we are updating any thing, we need to save it. This method tells the database that for now this is the final version, and we need to block it.
//                 return res.redirect('/');
//             });
//         }
//     });    
// }



// Method 2 - Asynchronous code
module.exports.create = async function(req,res){
    //IMPORTANT : The findById method is important, since the id of the post might be hidden for viewing but it is still visible in the html file, and any one can manipulate the data from there, so instead we will put a check on the back end itself, so here first we will find the Post by the given id and then we will put the comment on that post. This is why having a check from the back end is so necessary.
    try {
    let post = await Post.findById(req.body.post);    //Since there would be a lot of posts that would be in the db, so we first need to find it by the post and then we need to push the comment that we have newly created into the comments array. But this will be done with the help of a hidden input element 'post' that will be added in the form.    
        if(post){
            let comment = await Comment.create({
                content : req.body.content,
                user : req.user._id,        //We need to keep the userId that posted the comment. But here too req.user.password is accessible which should have not been accessible, and I have explained how we could solve this in the posts_controller.js create method comment, just read it from there.
                post : req.body.post      //We need to keep track of postId on which the comment has been made.
            });               
            await post.comments.push(comment);    //After the comment is successfully created and updated in its own database, we will update the comments in the post's array, which means we are updating and we have a slight different syntax for the updation.
            req.flash('success', 'Comment published!');
            await post.save();            //IMPORTANT : Whenever we are updating any thing, we need to save it. This method tells the database that for now this is the final version, and we need to block it.

            comment = await comment.populate('user', 'name email');
            console.log(comment);
            // commentsMailer.newComment(comment);      //IMPORTANT : Now with the case of kue integration, we will now be able to integrate the commentsControllers using the queue, when we are using the web workers and kue.js, we are not calling the comments controller we are calling in the queue that is managing the worker for the kue. And then we are calling the comment controllers from the web worker file.
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log("Error in sending to the queue", err);
                    return;
                }
                console.log(job.id);
            });
            return res.redirect('/'); 
        }   
    } catch (error) {
        req.flash('error', "Error in commenting.");
        console.log(error);
        return;
    }               
}



// Method 1 - Synchronous code.
// module.exports.destroy = function(req, res){
//     Comment.findById(req.params.id,function(err, comment){
//         if(comment.user==req.user.id){
//             // IMPORTANT : user.id gets the string of user._id and user._id is of type ObjectId;
//             let postId = comment.post;
//             comment.remove();
//             //This comment is being saved up in more than one place, first it is being saved in the comments schema and another it is being saved in the array of the comments inside the post schema, why was it saved twice, so that retrieval could be easy for both the sides, first from the comments array and second from the comments schema itself.
//             Post.findByIdAndUpdate(postId, {$pull : {comments : req.params.id}}, function(err, post){   
//                 // IMPORTANT : The syntax used here is a native mongodb syntax, not the mongoose syntax. Here we are pulling the comment with a specific id and then updating the whole array of comments.
//                 // IMPORTANT : User.deleteMany({age: {$gte: 10}, function(err){console.log(‘deleted’);});   This is also a good example of using the native mongodb syntax for the deletion purpose. For the age key, if we find anything greater than 10, then this will delete it, right now this is a kind of some complex query, and we can read the mongoose docs for applying any complex query.
//                 return res.redirect('back');
//             })
//         }
//         else{
//             return res.redirect('back');
//         }
//     })
// }



// Method 2 - Asynchronous code
module.exports.destroy = async function(req, res){
    try {
        let comment = await Comment.findById(req.params.id);
        if(comment.user==req.user.id){
            // IMPORTANT : user.id gets the string of user._id and user._id is of type ObjectId;
            let postId = comment.post;
            await comment.remove();
            //This comment is being saved up in more than one place, first it is being saved in the comments schema and another it is being saved in the array of the comments inside the post schema, why was it saved twice, so that retrieval could be easy for both the sides, first from the comments array and second from the comments schema itself.
            let post = await Post.findByIdAndUpdate(postId, {$pull : {comments : req.params.id}})
            // IMPORTANT : The syntax used here is a native mongodb syntax, not the mongoose syntax. Here we are pulling the comment with a specific id and then updating the whole array of comments.
            // IMPORTANT : User.deleteMany({age: {$gte: 10}, function(err){console.log(‘deleted’);});   This is also a good example of using the native mongodb syntax for the deletion purpose. For the age key, if we find anything greater than 10, then this will delete it, right now this is a kind of some complex query, and we can read the mongoose docs for applying any complex query.

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            req.flash('success', 'Comment deleted!');
            return res.redirect('back');        
        }
        else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }        
    } catch (error) {
        if(error){
            req.flash('error', error);
            console.log(error); 
            return;
        }
    }    
}