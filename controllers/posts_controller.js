const Post = require('../models/post')

module.exports.create = function(req,res){
    Post.create({
        content : req.body.content,
        user : req.user._id     //VERY IMPORTANT : req.user and res.locals.user are the same at this point, as this have been set in the setAuthenticated user, also as far as I could understand we are sending the password along with the req.user as req.user.password, DOUBT : How to stop the user from accessing the password. SOLUTION : I think when in the setAuthenticatedUser when we are assigning, res.locals.user = req.user; then in place of this we should have used res.locals.user = req.user._id; This way only the id of the use that is being deserialised would have been added to the res.locals.user and not the password.
    }, function(err, post){
        if(err){console.log('error in creating a post'); return;}
        return res.redirect('back');
    })
}