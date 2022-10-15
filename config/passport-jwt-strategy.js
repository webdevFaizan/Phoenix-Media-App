const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;       //We are extracting the strategy first.
const ExtractJwt = require('passport-jwt').ExtractJwt;      //This will help us in extracting jwt from the header.
const User = require('../models/user');

//In order to successfully utilize the authentication, we have to use the key for authentication.
//DOUBT : The header will contain the JWT, and for now we seem too curious, about what is header, we will know about it later.
var opts = {};      //This is the options object. We need this object to ensure how to get the different features. Like the encryption.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();     //Header is a list of keys. And one of those keys is authorization. And inside that we have jwt. This will extract the jwt from the bearer token. 
opts.secretOrKey = 'phoenix';      //This is the encrypting key, that will be used to encrypt or decrypt. This is the property of jwt tokens, we use the secret inside the json web tokens and it is used to encrypt and deprcypt everything into the jwt.


// IMPORTANT SUMMARY : This strategy here is only to decrypt the data from the jwt, in the api create-session route, we were using the function createSession() to create the back end api, which simply means we were simply creating the token and when we have to use this token we will use this file's code to decrypt and use it as required.



// In the callback function below, we have a jwtPayLoad, which will be extracted from the jwt, and the jwt contains 3 different part. And done is also the name of the callback that will be used to find the call the function after the action is completed.
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done) {     //This function will look similar to that of the passport-local-strategy, but here we are not matching the email and password, in here, the user is already present in the jwt, and we are just checking if the user is present in the jwt, if yes this means the user is authenticated.
    User.findById(jwtPayLoad._id, function(err, user) {     //In the passport api documentation, this function was not present, and findOne was present and that led to confusion since this function takes different parameter and it took me some time to debug the code.
        if (err) {
            console.log("error in jwtstrategy");
            return done(err, false);
        }
        if (user) { //if the user is authenticated, then passport will automatically set the user as req.user, this simply means the user will be ready to access what every it could access.
            console.log("jwt-user is " +user.id);
            return done(null, user);        //First parameter is false, means the error is null
        } else {
            return done(null, false);       //Second parameter is false, means the user function is not found.
            // or you could create a new account
        }
    });
}));



module.exports = passport;