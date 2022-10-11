// const mongoose = require('mongoose');
// import user form '../models/user';       //This is the ES module, whereas the require statement is a common JS module.
const User = require('../models/user');

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
            res.cookie('user_id', foundUser.id);
            return res.redirect('/users/profile');
        }
    }
}


module.exports.signIn = function(req,res){
    res.render('user_sign_in',{
        'title' : 'Sign In Page'
    })
}

module.exports.signUp = function(req,res){
    res.render('user_sign_up',{
        'title' : 'Sign Up Page'
    })
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    // IMPORTANT : In the manual authentication method, we were writing a logic to add the user_id to the cookie from this method itself, but now we are creating the session cookie in the passport-local-strategy itself. This will reduce redundant code, since we do not need to create session in all the different function like sign up and sign in as well. It the username and password was correct the session is created an stored in the passport-local-strategy file itself.
    res.redirect('/');
}
