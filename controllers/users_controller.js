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
    // steps to authenticate
    // find the user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing in'); return}
        // handle user found
        if (user){

            // handle password which doesn't match
            if (user.password != req.body.password){
                return res.redirect('back');
            }

            // handle session creation
            res.cookie('user_id', user.id);     //IMPORTANT : Creating the session does not mean anything special, it simply means we are storing the data of the user in cookie or local storage so that it could be used later on to verify the authenticity of the user and if or not the user is authorized to use the data he is trying to access.
            return res.redirect('/users/profile');

        }else{
            // handle user not found
            return res.redirect('back');
        }
    });
}
