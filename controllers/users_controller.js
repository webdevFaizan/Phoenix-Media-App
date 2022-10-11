// const mongoose = require('mongoose');
// import user form '../models/user';
const user = require('../models/user');

module.exports.profile = function(req,res){
    res.render('user_profiles',{
        'title' : 'User Profile Page'
    })
}

module.exports.createUser = function(req,res){
    // const foundUser = await user.findOne({email : req.email});
    // if(foundUser){
    //     console.log('user already exists, please try a new email id.');
    //     res.send('back');
    // }
    // else{
    //     foundUser = await user.create({email : req.body.email, password : req.body.password, name : req.body.name});
    //     if(foundUser){
    //         console.log('user created');
    //         res.render('home',{
    //             'title' : 'User Profile Page',
    //             'name' : req.body.name
    //         })
    //     }
    // }
    
    console.log(req);
    // console.log(req.body.email);
    // console.log(req.body.password);
    // console.log(req.body.name);

    res.render('home',{
        'title' : 'User Profile Page',
        'name' : 'Just Signed up'
    })
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