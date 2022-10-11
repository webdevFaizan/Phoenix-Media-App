// IMPORTANT : Passport js is the most popular library used for authentication with Node.js. One of the best parts is that it’s middleware based, the nature of it being a middleware is inbuilt.


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;   //We require Strategy here, so just remember this up.
const User = require('../models/user');


//authentication using passport local strategy -
// Summary - We are using the passport.js to authenticate the user, and we are using LocalStrategy for this, where we are setting the email as a unique field and then in the callback function we are going to check whether the authentication is completed or not.
// IMPORTANT Summary - This method here is a middleware its function is to find the user and authenticate the user. Then the function control will go to the next function, which is serialize user, then the middleware will go the controller function or whereever it needs to go.
passport.use( new LocalStrategy({
    usernameField: 'email',         //This part is only added to tell passport variable that email is the usernameField and it has to be kept unique.
    passReqToCallback : true        //This key value pair is passed so that req object is available in the function below, this will be used to send the flash message in case the user has put in the wrong password.
},
//Done is the callback function that is reporting back to the passport.js
    function (req, email, password, done) {  //After creation of the LocalStrategy, this done function will consist of the command that will be executed after the LocalStrategy will be created, and it will consist whether there is an error or success.

        // find a user and establish the identity
    User.findOne({ email: email }, function (err, user) { //Findone method takes first parameter as the unique identifier and in this case it is email.
        if (err) {
            // console.log('Error in finding user --> Passport');
            req.flash('error',"There is some error");
            return done(err);
            // IMPORTANT : This done method always takes 2 parameters, the first one is error, if there is no error, then we can pass null, which is done in the below function, and since this is javascript, therfore when the second parameter is not even passed, this function will properly run. This kind of behaviour is very different in the case of other languages like Java.
        }

        if (!user || user.password != password){
            // console.log('Invalid Username/Password');
            // req.flash('error',"Invalid Username/Password"); //The custom flash message will be called using a centralised middleware. And we are sending the message from this callback to the flash middleware using this req.flash. This could only be done when we are using req object in this function. For this we need to add a new key value pair in the LocalStrategy object, passReqToCallback() method.
            return done(null, false);       //The first parameter is null, it means there is not error, but the second parameter is false, this means some other problem is there like the password mismatch or username missing.
        }

        return done(null, user);    //The first parameter is null, it means there is no error, but the second parameter is user, this means no other problem is there and we are ready to pass the user.
    });
}));


// serializing the user to decide which key is to be kept in the cookies
// Summary - The below function is being called after above middleware is called, now it will take the id variable from the user that has been created above and keep it inside the session-cookie.
passport.serializeUser(function(user, done){        //No need to mug up this function, we could just google search how the process is done after the user is identified in the method passport.use, just google "how to store the id of user as session id after authentication using passport.js" You will get a stack overflow link. - [https://stackoverflow.com/questions/66907504/passport-session-i-want-store-user-information-in-session-but-only-id-in-brow]
    done(null, user.id);        //IMPORTANT : In the manual authentication, we were keeping the user_id inside the cookie function, so that we could extract it anytime when we wanted to have the session information, in passport.js too, we only want the user.id to be kept inside the cookie, in order to keep check of the identity, this is kept in the form of session cookie, which means it will be kept encrypted. And we do not need to take care of the encryption.
});

//Done is not a fixed name, we could call it completed or anything. Just a variable name



// deserializing the user from the key in the cookies
// IMPORTANT : After this deserializeUser method, one cycle is complete, during the creation of the session, the id is taken any is encrypted, and this method here is helping us in decerailizing the id from the main function.
// IMPORTANT Summary - The below function is being called after the next req comes in and the req object has to decrypt which user it is to establish the indetity of the user, it will decrypt the id variable from the session cookie.
passport.deserializeUser(function(id, done){        //id is simply a variable that is kept to store the value of the variable from the cookie, and it will be first decrypted then it will be used to find the user associated with it.
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        return done(null, user);            //This is a method that attatches the 'user' with all the endpoints, as all the end points will pass through this deserializeuser method. This is like a middle ware for the parsing of user identity from the cookie. I had a very confusing doubt that passport.setAuthenticatedUser is attaching the user req.user to every end point but that is not true.
    });
});

module.exports = passport;