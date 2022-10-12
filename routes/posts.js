const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication, postsController.create);
//VERY IMPORTANT : This route is for creating the post from the front end to the back end by calling onto this route, and since we are not allowing any anonymous user to post something without a valid credential, and we are not even showing the form there, but what if some hacker is very smart and he edits the html and inserts the form tag, and call the action, this would be 1st breach, but this is exactly where the check from the back end comes to be useful, since I am using a middleware passport.checkAuthentication, so even if the hacker has edited the front end, he will not be able to pass the middleware, because he is not logged in. This is why we should not only rely on the front end and also on the back end for security purpose.


module.exports = router;