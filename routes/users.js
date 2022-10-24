const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
// router.get('/profile/:id', passport.checkAuthentication, usersController.otherUserProfile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);


router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.get('/sign-out', usersController.destroySession);


router.post('/create', usersController.create);
router.post('/create-session', passport.authenticate(   // IMPORTANT : This is the main function of the middle ware, as we hit the route, before passing the control to the controller function, this passport.authenticate method will run. This is exactly where the done function will come in handy (as done function was returning to the passport), the done method will only run when there absolutely no error and done returns to passport itself. And from there when passport.authenticate checks it, it will call the controller function.
    'local',
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);       // IMPORTANT : This whole function is going to create a session cookie, and unlike the manual authentication, we will not be taking the user.id in the cookie. Instead of that we will be having a hash type of string that will be created on each user. And this will be encrypted as well as secure. For that we have already installed the express-session and the passport.js will keep that express-session cookie, serialize it after authentication and finally use it.


router.get('/create-friend/:id', passport.checkAuthentication, usersController.createFriend);
router.get('/destroy-friend/:id', passport.checkAuthentication, usersController.deleteFriend);
router.get('/forgot-password', usersController.forgotPassword);
router.get('/reset-password', passport.checkAuthentication, usersController.resetPassword);
router.post('/generate-forgot-token', usersController.generateForgotToken);


//IMPORTANT : The following is the router to handle the reset password.
router.get('/authentication/:token', usersController.verifyToken);      //IMPORTANT : Initially I was having a /:token, which means when other routes below this line of code, the control will automatically enter into this controller, it is kind of a partial match, but since we want to enter into this link only when the route is an exact match, but for that we need to have a /authentication/:token to uniquely identify it as compared to others.


//Password to be updated after token verification.
router.post('/update-password', usersController.updatePassword);
router.post('/confirm-password', passport.checkAuthentication, usersController.confirmPassword);


router.get('/delete-account', usersController.deleteAccount);


//IMPORTANT : The interesting part about this route is that '/auth/google' is already given by passport library. When ever we try to access this route, then this will automatically call the google-oauth-strategy. This passport.authenticate is telling the app to use the specified strategy for authentication, with some other parameters that are usually avaialble in the docs, read the docs for this.
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));     //IMPORTANT : scope is the list of variable that we are seeking to access, profile information we want, also the 'email' is an extra information that will be required, so we need to add it manually, as email is not the part of profile.

// The following is the url at which we will receive the data. This is similar to something of the local-strategy. Before creating the session, we need to check if the authentication is ok or not, if it is not then this will be redirect to the sign-in page.
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);


// IMPORTANT : We need the passport-local-strategy even when we are using google to login, this is simply because an authorization from google account needs to be saved so that we could even remember on a later stage that a user that logged in from google was also present in the db.




module.exports = router;