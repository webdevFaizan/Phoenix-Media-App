const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
// router.get('/profile/:id', passport.checkAuthentication, usersController.otherUserProfile);
router.post('/update/:id',passport.checkAuthentication, usersController.update);


router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.get('/sign-out', usersController.destroySession);


router.post('/create', usersController.create);
router.post('/create-session', passport.authenticate(   // IMPORTANT : This is the main function of the middle ware, as we hit the route, before passing the control to the controller function, this passport.authenticate method will run. This is exactly where the done function will come in handy (as done function was returning to the passport), the done method will only run when there absolutely no error and done returns to passport itself. And from there when passport.authenticate checks it, it will call the controller function.
    'local',
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);       // IMPORTANT : This whole function is going to create a session cookie, and unlike the manual authentication, we will not be taking the user.id in the cookie. Instead of that we will be having a hash type of string that will be created on each user. And this will be encrypted as well as secure. For that we have already installed the express-session and the passport.js will keep that express-session cookie, serialize it after authentication and finally use it.

module.exports = router;