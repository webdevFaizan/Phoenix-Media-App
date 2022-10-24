// const mongoose = require('mongoose');
// import user form '../models/user';       //This is the ES module, whereas the require statement is a common JS module.
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friends = require('../models/friends');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const resetPasswordMailer = require('../mailers/reset_password_mailer.js');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        let isFriend = false;
        for(u of req.user.friends)
        {
            if(u==req.params.id){
                isFriend = true;
            }
        }
        return res.render('user_profiles', {
            title: 'User Profile',
            profile_user : user,
            isFriend : isFriend
        })
    })    
}


//METHOD 1 - Synchronous update function.
// module.exports.update = function(req, res){
//     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
//             // In this case the req.body is exactly equal to {name: req.body.name, email: req.body.email} this is why we do not need to write it separately.
//             req.flash('success', 'Updated!');            
//             return res.redirect('back');
//         });
//     }else{
//         req.flash('error', 'Unauthorized!');
//         return res.status(401).send('Unauthorized');
//     }
// }


//Method 2 - Asynchronous update function that can include the file upload functionality.
module.exports.update = async function(req, res){       //This update form is being created after we have added the feature of avatar in the whole website, now 
    //We are not checking whether wrong user will be able to access this method or not, since if we came to this method it was only when the user is genuinely trying to change this, since we have already checked for authentication in the middle ware that is accessing this page.    
       if(req.user.id == req.params.id){
           try {
            // let user = await User.findByIdAndUpdate(req.params.id, req.body);    //IMPORTANT : findByIdAndUpdate() is a method that cannot run in the case when the form is a multipart form. BODYPARSER only processes the request when the form contains only string data in it.
                let user = await User.findById(req.params.id);  //We cannot directly update the document by putting in req.body.
                //There is one confusion though, this command is only finding the user by its id, not updating it, so how do we make sure the data is updated? I got the answer, user.save() method in the method below is going to update the document. So the finding part could now be separate as well as the updating part could also be separate.
                //Now there is one thing here, the body parser cannot directly access the content of the form that is being submitted. Since the enctype of the form is multi from and this is not like general form that consists of only string and integer based data.  This is exactly where the statics.uploadedAvatar method will be properly used.
                User.uploadedAvatar(req, res, function(err){    //The multer.diskStorage function inside the user.js model consists of req and response, and function here makes the req and response capable of sending the image file.
                    if (err) {console.log('*****Multer Error: ', err)}                
                    user.name = req.body.name;      //We would have not been able to read the name and email field since this is the multipart form and not the general form, this is how we read through the multi part form. In the multipart form the name of the user and content of photo and videos will be accessible in a different manner.
                    user.email = req.body.email;        //Once we submit the form, this data will be transmitted as req.body.
                    if (req.file){
                        if (user.avatar){   //This check if in the new form that we are submitting, whether there is any user.avatar present or not. If there is no user avatar means we are uploading a new file. If it exists this means we have had an avatar for this user already and it needs to be deleted if we do not want the old avatars to be saved forever.
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar)); //If the path name in the user.avatar exist, but some hacker has deleted the database, and if we use this method to delete a file that has a path name but the actual file is missing, then in that case, this method will give an error. It will work fine if the path name of the user.avatar and the file is actually present at the designated location, but if it is not then this try catch block will not let the whole website crash. And after this if condition, the path of user.avatar will be updated. And there will be only one current file for one current avatar. Along with its value of the path in the user.avatar
                        }
                        // this is saving the path of the uploaded file into the avatar field in the user
                        user.avatar = User.avatarPath + '/' + req.file.filename;    //This is the value of avatar variable, that will be used to save(as a path), and since this is not required in models, the value of avatar will always not be avaialble, only when user updates it avatar then it will be available, this also means, we could update the details of user or add additional profile field even after creating the later version of website. This is simply because, we have not kept this field as compulsory.
                    }
                    user.save();
                    return res.redirect('back');
                });
        
            }catch(err){
                req.flash('error', err);
                return res.redirect('back');
            }
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
    }catch(error){
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
    let name;
    if(req.user){
        name = req.user.name;
    }
    req.logout(function(err) {       //This function is being provided by the passport to the request object, which means it will be able to clear the request object of any session that we have created, which also means we do not need to manually delete the session cookie or deauthenticate the user, he/she will be automatically deauthenticated.
        // IMPORTANT : Since version 0.6.0 (which was released only a few days ago by the time of writing this), req.logout is asynchronous. This is part of a larger change that averts session fixation attacks.
        let str = 'You have logged out! ';
        if(name){
            str=str+' '+name;
        }
      req.flash('success', str);
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




module.exports.createFriend = async function(req, res){
    try {
        let user = await User.findById(req.user.id);
        if(user){
            user.friends.push(req.params.id);
            await user.save();
        }
        let user2 = await User.findById(req.params.id);
        if(user2){
            user2.friends.push(req.user.id);
            await user2.save();                
        } 
        let friendsRelation = await Friends.create({
            from_user : req.user.id,
            to_user : req.params.id
        });
        if(friendsRelation){
            console.log('Friends Relation Established.');
        }
        return res.redirect('back');
    } catch (error) {
        console.log(error);
    }    
}




module.exports.deleteFriend = async function(req, res){
    try {
        let user = await User.findById(req.user.id);
        if(user){
            user.friends.pull(req.params.id);
            await user.save();
        }
        let user2 = await User.findById(req.params.id);
        if(user2){
            user2.friends.pull(req.user.id);
            await user2.save();                
        }
        let found1 = await Friends.findOne({from_user: req.user.id});
        let found2 = await Friends.findOne({from_user: req.params.id});
        if(found1)
        found1.remove();
        if(found2)
        found2.remove();

        // Friends.save();
        return res.redirect('back');
    } catch (error) {        
        console.log(error);
    }
    return res.redirect('back');
}


module.exports.forgotPassword = function(req, res){
    console.log('Inside forgot Password method');

    return res.render('forgot_password',{
        title : 'Forgot Password Page'
    });
    // return res.redirect('back');
}


module.exports.resetPassword = function(req,res){
    console.log('Inside reset Password method');
    // return res.render('reset_password.ejs', {
    //     title : 'Reset Password page.',
    //     email : req.user.email
    // })    
    return res.render('confirm_password',{
        title: "Please Confirm your password.",
        email : req.user.email
    })
}


module.exports.generateForgotToken = async function(req,res){
    // console.log(req.body.email);
    let email = req.body.email;
    let token = jwt.sign({email : req.body.email} , 'phoenix', {expiresIn : 100000});
    console.log(token);
    resetPasswordMailer.resetPassword(token,email);
    // let verifiedToken = jwt.verify(token,'phoenix');
    // console.log(verifiedToken);
    return res.redirect('back');
}


module.exports.verifyToken = async function(req,res){
    console.log('Token received');    
    let verifiedToken = jwt.verify(req.params.token,'phoenix');    
    let user = await User.findOne({email : verifiedToken.email});   
    console.log(verifiedToken);
    if(user){
        return res.render('reset_password',{
            email : verifiedToken.email,
            title : "Reset Password Page"
        })
    }
    else{
        return res.redirect('/users/sign-in');
    }
}

module.exports.updatePassword = async function(req,res){
    if(req.body.pass!==req.body.confirmPass){
        console.log('Password does not match.');
        return res.redirect('/users/sign-in');
    }
    else{
        let user = await User.findOneAndUpdate({email : req.body.email}, {password : req.body.pass}, {new : true});
        console.log(user);
        console.log('Password updated');
        return res.redirect('/users/sign-in');
    }
}


module.exports.deleteAccount = async function(req,res){
    console.log("Inside the delete account method.")
    let user =  await User.findOne({email : req.user.email});    
    console.log(user);
    if (user){
        user.remove();
        // user.save();
    }
    // req.logout();
    return res.redirect('/users/sign-out');
}


module.exports.confirmPassword = async function(req,res){    
    try {
        console.log('Confirm password method')
        let user = await User.findOne({email : req.body.email});
        if(!user){
            console.log('User not found.');
            return res.redirect('/');
        }

        if(user.password!=req.body.pass){
            console.log("Password entered is wrong");
            return res.redirect('back');
        }
        else if(user.password===req.body.pass)
        {
            let user = await User.findOneAndUpdate({email : req.body.email},{password : req.body.pass}, {new : true});
            console.log('Password Updated');
            return res.render('reset_password',{
                title : "Reset the password",
                email : req.body.email
            })
        }        
    } catch (error) {
        console.log(error);
    }    
    return res.redirect('/users/sign-in');
}