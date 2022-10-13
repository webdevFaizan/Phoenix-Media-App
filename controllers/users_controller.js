// const mongoose = require('mongoose');
// import user form '../models/user';       //This is the ES module, whereas the require statement is a common JS module.
const User = require('../models/user');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profiles', {
            title: 'User Profile',
            profile_user : user
        })
    })    
}

module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            // In this case the req.body is exactly equal to {name: req.body.name, email: req.body.email} this is why we do not need to write it separately.
            req.flash('success', 'Updated!');            
            return res.redirect('back');
        });
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// module.exports.otherUserProfile = function(req, res){
//     User.findById(req.params.id, function(err, user){
//         return res.render('user_profiles', {
//             title: 'User Profile',
//             user : user
//         })
//     })
// }



module.exports.create = async function(req,res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    try {
        var foundUser = await User.findOne({email : req.body.email});
        if(foundUser){
            console.log('user already exists, please try a new email id.');
            res.redirect('/users/sign-in');
        }
        else{
            foundUser = await User.create({email : req.body.email, password : req.body.password, name : req.body.name});
            if(foundUser){
                req.flash('success', 'You have signed up, login to continue!');
                console.log('user created');
                res.cookie('user_id', foundUser.id);
                return res.redirect(`/users/profile/${foundUser.id}`);
            }
        }
    } catch (error) {
        req.flash('error', err);
    }

    
}


module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect(`/users/profile/${req.user.id}`);
    }
    return res.render('user_sign_in',{
        'title' : 'Sign In Page'
    })
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect(`/users/profile/${req.user.id}`);
    }
    return res.render('user_sign_up',{
        'title' : 'Sign Up Page'
    })
}


module.exports.destroySession = function(req, res, next) {
    let name = req.user.name;
    req.logout(function(err) {       //This function is being provided by the passport to the request object, which means it will be able to clear the request object of any session that we have created, which also means we do not need to manually delete the session cookie or deauthenticate the user, he/she will be automatically deauthenticated.
        // IMPORTANT : Since version 0.6.0 (which was released only a few days ago by the time of writing this), req.logout is asynchronous. This is part of a larger change that averts session fixation attacks.
      req.flash('success', 'You have logged out! '+name);
      if (err) { return next(err); }
      return res.redirect('/');
    });
  }


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully '+req.user.name);     //IMPORTANT : We come to this line after the control travelling from the middleware, where the res.locals is being set as the custom flash message.
    // IMPORTANT : In the manual authentication method, we were writing a logic to add the user_id to the cookie from this method itself, but now we are creating the session cookie in the passport-local-strategy itself. This will reduce redundant code, since we do not need to create session in all the different function like sign up and sign in as well. It the username and password was correct the session is created an stored in the passport-local-strategy file itself.
    // res.redirect(`/users/profile/${req.user.id}`);
    return res.redirect('/');
}
