const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: '919416897836-esdb7f4rmjofopcavqon67lh1ib8j895.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com, this will be available when you register the app on the google developers console. You have to register there first if you want to use this strategy, because google must also be aware of your app, or else google's server will think you are spamming its servers this is why the clientID and the clientSecret is required.
        clientSecret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
        callbackURL: "http://localhost:8000/users/auth/google/callback",        //This is the url that the google must take so that when the authentication is complete, it will go to that url.
    },
    // The following is the callback function that will be called if the clientID and the clientSecret gives us a correct result, that the credentials for using the google.developer app is correct. If that, then the following accessToken and the refreshToken and the profile will be returned.
    
    // IMPORTANT : Since the following is a callback function, which simply means it is like an event handler, and when you click on the google account that you wish to consider, then this callback will be fired. Then only the 'profile' information will be available, this is why we need to have callback, because it will give time for user to select the google account and by that time it will keep on waiting.
    function(accessToken, refreshToken, profile, done){
        // If our accessToken expires then we will use our refreshToken to get a new accessToken. This will allow the user to be logged in without a need to login again.
        // profile will contain the user information. And once you select the profile, it will contain all the user email required for login.
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){        //VERY IMPORTANT : We are using the email to find the existance of user. This is why if you login directly or through google oauth both will give you an access to the account.
            if (err){console.log('error in google strategy-passport', err); return;}
            // console.log(accessToken, refreshToken);
            // console.log(profile);
            console.log(profile.emails);        //IMPORTANT : I do not know the logic behind this array of emails, if we click on one email then only one email will always be there, but never mind this is just template syntax. Here this field also returns us verified : true/false, which could be used to check if the email being used to sign up is fake or spam or even being used on a regular basis or not, if not then you could use this data as well.
            if (user){
                //IMPORTANT : if found, set this user as req.user, this done method was also present in the passport-jwt-strategy, the syntax for these things are kind of similar to remember.
                return done(null, user);    // IMPORTANT : If you logged in using oauth then there is no need to enter the password as your identity has been verified by google. This is why we do not have a use of password, only the email must match.
            }else{
                //IMPORTANT : If not found, create the user and set it as req.user, and in this case you do not need to enter your own password, this is completely understood, since next time when you login, you will use the google-oauth again which would require only the need for email. But if you want to switch from google-oauth for a particular email, then you can easily reset the password.
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}
                    return done(null, user);
                });
            }


            //IMPORTANT : WE CAN DELETE THE ACCESS TOKEN AS WELL. So tha no one can use it after we have created the account. But we will have to study the docs for this.
            //Also while signing out of the Phoenix-Media-App we could also sign out of google account, all of this is in the docs but we do not do this, since it would be an irritating experinece for user, as no one want to log in to google multiple times.
        }); 
    }
));
module.exports = passport;