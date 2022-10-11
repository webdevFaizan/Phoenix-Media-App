// const mongoose = require('mongoose');
// import user form '../models/user';       //This is the ES module, whereas the require statement is a common JS module.
const User = require('../models/user');


// This authentication process is done just as a manual process, since we are manually checking the value of id stored in the cookie....
module.exports.profile = function(req, res){
    if (req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err, user){
            if (user){
                return res.render('user_profiles', {
                    title: "User Profile",
                    user: user
                })
            }else{
                return res.redirect('/users/sign-in');
            }
        });
    }else{
        return res.redirect('/users/sign-in');
    }    
}

// The following is being done in the case of manual authentication, and this I am going to commit on this branch, one issue with this manual authentication is that even if we have authenticated, we can even access the sign-in page, this is an issue because a logged in user should never be shown the sign in page, which will automatically be taken care in the case of automatic authentication using passport JS, the passport JS is just like as its name, it is like a passport when user's request crosses the boundary of the front end to the boundry to the back end, and every time you have to be authenticated since the server does not remember anything about you, as it is a stateless protocol.
module.exports.create = async function(req,res){
    var foundUser = await User.findOne({email : req.body.email});
    if(foundUser){
        console.log('user already exists, please try a new email id.');
        res.redirect('/users/sign-in');
    }
    else{
        foundUser = await User.create({email : req.body.email, password : req.body.password, name : req.body.name});
        if(foundUser){
            console.log('user created');
            res.cookie('user_id', foundUser.id);    //When a new user signs up, we do not want him to login again, instead we will automatically create a session for him so that he/she could be authenticated. 
            // DOUBT : Why are we able to access the id using foundUser.id and not by foundUser._id, since in the db this data is saved using _id.
            return res.redirect('/users/profile');
        }
    }
}


module.exports.signIn = function(req,res){
    if(req.cookie.user_id){
        res.redirect('/users/profile');
    }
    res.render('user_sign_in',{
        'title' : 'Sign In Page'
    })
}

module.exports.signOut = function(req,res){
    if(req.cookie.user_id){
        // res.redirect('/users/profile');
        res.cookie('user_id',null);    
        res.render('user_sign_in',{
            'title' : 'Sign In Page'
        })
    }
    else{
        res.redirect('/users/sign-in');
    }
}

module.exports.signUp = function(req,res){
    if(req.cookie.user_id){
        res.redirect('/users/profile');
    }
    else{
        res.render('user_sign_up',{
            'title' : 'Sign Up Page'
        })
    }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    // steps to authenticate
    // 1.find the user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('error in finding user in signing in'); 
            return;
        }
        // 2.handle user found
        if (user){
            // 3.handle password which doesn't match
            // Right now the password is being carried using normal un encrypted methods, but in the real scenario we will use the encrypted version of the password that will be created using salt and pepper.
            if (user.password != req.body.password){
                return res.redirect('back');
            }

            // 4.handle session creation
            res.cookie('user_id', user.id);     //IMPORTANT : Creating the session does not mean anything special, it simply means we are storing the data of the user in cookie or local storage so that it could be used later on to verify the authenticity of the user and if or not the user is authorized to use the data he is trying to access.
            return res.redirect('/users/profile');
        }else{
            // 5.handle user not found
            return res.redirect('back');
        }
    });
}
