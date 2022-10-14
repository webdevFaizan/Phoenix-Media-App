const Post = require('../models/post');
const Comment = require('../models/comment');


// Method 1 - Callback hell.
// module.exports.create = function(req,res){
//     Post.create({
//         content : req.body.content,
//         user : req.user._id     //VERY IMPORTANT : req.user and res.locals.user are the same at this point, as this have been set in the setAuthenticated user, also as far as I could understand we are sending the password along with the req.user as req.user.password, DOUBT : How to stop the user from accessing the password. SOLUTION : I think when in the setAuthenticatedUser when we are assigning, res.locals.user = req.user; then in place of this we should have used res.locals.user = req.user._id; This way only the id of the use that is being deserialised would have been added to the res.locals.user and not the password.
//     }, function(err, post){
//         if(err){console.log('error in creating a post'); return;}
//         return res.redirect('back');
//     })
// }


// Method 2 - Asynchronous functions.
module.exports.create = async function(req,res){
    try {
        let post = await Post.create({
            content : req.body.content,
            user : req.user._id     //VERY IMPORTANT : req.user and res.locals.user are the same at this point, as this have been set in the setAuthenticated user, also as far as I could understand we are sending the password along with the req.user as req.user.password, DOUBT : How to stop the user from accessing the password. SOLUTION : I think when in the setAuthenticatedUser when we are assigning, res.locals.user = req.user; then in place of this we should have used res.locals.user = req.user._id; This way only the id of the use that is being deserialised would have been added to the res.locals.user and not the password.
        }); 
        
        // IMPORTANT : This is the first thing we created after creating the $.ajax request, req.xhr means it checking if the request is of ajax type, if yes then it is simply sending the data in the form of json. And this will be received in the success message of the createPost() function of the home_posts.js
        if(req.xhr){
            //IMPORTANT : if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it! but we must also remember the content and the user has already been populated, since this post is not fetched from the db, but instead we are only populating the user's name.
            post = await post
            .populate({
                path : 'user',
                populate: {
                    path: 'name'
                }
            });
            return res.status(200).json({
                data : {
                    post : post
                },
                message : "Post created!"
            })
        }
        
        if(post){
            // IMPORTANT : In the case of xhr request, this flash message is not published on the front end, since the session-cookie is not being updated and the session cookie gets updated when the page gets refreshed. This is why we need to put this in the createPost() function of the home_posts.js
            req.flash('success', 'Post published!');
            return res.redirect('back');        
        }
    } catch (error) {
        if(error){
            req.flash('error', error);
            console.log('error in creating a post'); 
            return;
        }        
    }
}


//Method 1 - Of the delete method. Not using the AJAX call
//This code could be transformed to async and await, since this code is having two layers of callbacks. And one need to be called after the other has been properly executed. This is the exact scenario where the async and await works.
// module.exports.delete = function(req,res){
//     // console.log(req.params.postId);
//     // console.log('Inside the delete post');
//     Post.findById(req.params.id, function(err,post){
//         if(err){
//             console.log(err);
//             // req.flash('error','Some error occured.');
//             return;
//         }
//         //IMPORTANT : Note here, we are not taking req.user._id as this would be an Object. But instead we will be taking req.user.id, as this would be the string version of the id. And we want string to be compared with the help of ==, IMPORTANT : Mongoose gives us this inbuilt functionality of converting the object to string, so that the comparision becomes easy.
//         if(post.user==req.user.id){       //IMPORTANT : If we use locals here, it will not be defined, since locals are only defined for the views so basically we could only use it for ejs files.
//             post.remove();
//             Comment.deleteMany({post : req.params.id}, function(err){
//                 if(err){console.log(err);return;}
//                 // return res.redirect('/');
//             });
//             console.log('Post delete kr diye be.');
//         }else{
//             console.log('The post does not exist');
//             // req.flash('error','Post could not be deleted, some error occured.');
//         }
//         // req.flash('success','Post deleted.');       //This message is inside the callback hell, it is not being passed to the res.locals.flash, so this will never be displayed as a pop up message, I have researched about it, just find "JavaScript Callbacks Variable Scope Problem" topic in node.docs file and you will get the answer.
//         return res.redirect('back');
//     });
//     // req.flash('success','Post deleted.');            //This will show the pop up message as it will go to the global res.locals.flash, I have explained this problem in a great detail in the "JavaScript Callbacks Variable Scope Problem".
//     // console.log('Post not found');
//     // return res.redirect('back');
// }



// Method 2 - Asynchronous method 2. There are some extra points written in the method 1 of this same function, read it for complete understanding.
module.exports.delete = async function(req,res){
    try {
        let post = await Post.findById(req.params.id);
        //IMPORTANT : Note here, we are not taking req.user._id as this would be an Object. But instead we will be taking req.user.id, as this would be the string version of the id. And we want string to be compared with the help of ==, IMPORTANT : Mongoose gives us this inbuilt functionality of converting the object to string, so that the comparision becomes easy.
    
        if(post.user==req.user.id){       //IMPORTANT : If we use locals here, it will not be defined, since locals are only defined for the views so basically we could only use it for ejs files.
            await post.remove();
            await Comment.deleteMany({post : req.params.id})
            // console.log('Post is deleted.');
            // req.flash('success', 'Post and associated comments deleted!');   //In case of the ajax request this req.flash will not be visible, since the session-cookie is not being loaded again as we are not refreshing the page, but instead we need to send the new Noty() object from the ajax function in the home_posts.js file in the deletePost function itself.
            if(req.xhr){
                return res.status(200).json({
                    data : {
                        post_id : req.params.id
                    },
                    message : "Post deleted"
                })
            }
        }else{
            req.flash('error', 'You cannot delete this post!');
            // console.log('The post does not exist');
            // req.flash('error','Post could not be deleted, some error occured.');
            return res.redirect('back');
        }
        // req.flash('success','Post deleted.');       //This message is inside the callback hell, it is not being passed to the res.locals.flash, so this will never be displayed as a pop up message, I have researched about it, just find "JavaScript Callbacks Variable Scope Problem" topic in node.docs file and you will get the answer.
        return res.redirect('back');        
    } catch (error) {
        console.log(err);
        req.flash('error', "Cannot post, something went wrong.");
        return res.redirect('/');
    }
}


