const Post = require('../models/post');
const User = require('../models/user');



// IMPORTANT : METHOD 1 - This version of function is very important, read it before going to the async await function.
// module.exports.home = function(req, res){
//     // console.log(req.cookies);       //IMPORTANT : cookie always comes from the request, because it is the duty of the client to make itself remembered in the case of stateless protocol and also cookie is of use when we want some work to be done on the server side, so when ever this function is being accessed by accessing the route that is calling this function, the request will consists of the cookie.
//     //And if you wish to alter the contents of the cookie, then this should be done in the response, since all the processing will be done in this function itself and then after the proper processing of the data, cookie will or any other data will be sent back to the response.

//     // res.cookie('user_id',1223);      //IMPORTANT : Now this cookie will show up in the Application tab of the inspect elements, where the value will be changed to 23.
//     // This above line of code also tells us that the cookie can be altered from the server side, or it could be altered from the client side, since any behaviour tracking could be done by the cookie, and if on the client side you have a change in behaviour then the cookie will be changed.

//     // In this we are trying to populate the user from the id and then comments from that posts. The comments and the user is then populated at the time of retrieval.
//     Post.find({})
//     .sort('-createdAt')
//     // IMPORTANT : For sorting the post we have used the sort method and to sort in the decending order we used a - sign, this will do the job.
//     .populate('user')
//     .populate({
//         path: 'comments',
//         populate: {
//             path: 'user'
//         }
//     })
//     .exec(function(err, posts){     //Initially the callback function was just inside th Post.find() method, but since the QUERY has changed from simple finding of the post to populating the user of the post, this means we will have the callback function inside the exec function.
//         User.find({},function(err, users){
//             return res.render('home', {     //This file 'home.ejs' will be automatically looked upon in the views folder becuase we have set the view engine to be searched in that file itself.
//                 title: "Phoenix | Home",
//                 posts:  posts,
//                 all_users : users
//             });
//         })
//     })
// }


// IMPORTANT : METHOD 2 - This version of function is asynchronous as it makes the method non-synchronous.
module.exports.home = async function(req, res){
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate : {
                path : 'likes'      //This will populate the likes of the comments of the post.
            }
        }).populate('likes');       //This will populate the likes of the post.
        let users = await User.find({});
        return res.render('home', {
            title: "Phoenix Media App | Home",
            posts:  posts,
            all_users: users
        });
    }catch(err){
        console.log('Error', err);
        return;
    }
}   