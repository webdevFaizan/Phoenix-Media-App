const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req,res){
    Post.create({
        content : req.body.content,
        user : req.user._id     //VERY IMPORTANT : req.user and res.locals.user are the same at this point, as this have been set in the setAuthenticated user, also as far as I could understand we are sending the password along with the req.user as req.user.password, DOUBT : How to stop the user from accessing the password. SOLUTION : I think when in the setAuthenticatedUser when we are assigning, res.locals.user = req.user; then in place of this we should have used res.locals.user = req.user._id; This way only the id of the use that is being deserialised would have been added to the res.locals.user and not the password.
    }, function(err, post){
        if(err){console.log('error in creating a post'); return;}
        return res.redirect('back');
    })
}



//1st version of the deletePost method. Not using the AJAX call
//This code could be transformed to async and await, since this code is having two layers of callbacks. And one need to be called after the other has been properly executed. This is the exact scenario where the async and await works.
module.exports.delete = function(req,res){
    // console.log(req.params.postId);
    // console.log('Inside the delete post');
    Post.findById(req.params.id, function(err,post){
        if(err){
            console.log(err);
            req.flash('error','Some error occured.');
            return;
        }
        //Note here, we are not taking req.user._id as this would be an Object. But instead we will be taking req.user.id, as this would be the string version of the id. And we want string to be compared with the help of ==, IMPORTANT : Mongoose gives us this inbuilt functionality of converting the object to string, so that the comparision becomes easy.
        if(post.user==req.user.id){       //IMPORTANT : If we use locals here, it will not be defined, since locals are only defined for the views so basically we could only use it for ejs files.
            post.remove();
            Comment.deleteMany({post : req.params.id}, function(err){
                if(err){console.log(err);return;}
                // return res.redirect('/');
            });
            console.log('Post delete kr diye be.');
        }else{
            console.log('The post does not exist');
            // req.flash('error','Post could not be deleted, some error occured.');
        }
        // req.flash('success','Post deleted.');       //This message is inside the callback hell, it is not being passed to the res.locals.flash, so this will never be displayed as a pop up message, I have researched about it, just find "JavaScript Callbacks Variable Scope Problem" topic in node.docs file and you will get the answer.
        return res.redirect('back');
    });
    // req.flash('success','Post deleted.');            //This will show the pop up message as it will go to the global res.locals.flash, I have explained this problem in a great detail in the "JavaScript Callbacks Variable Scope Problem".
    console.log('Post not found');
    // return res.redirect('back');
}