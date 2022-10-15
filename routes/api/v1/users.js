const express = require('express');

const router = express.Router();
const usersApi = require('../../../controllers/api/v1/users_api');


router.post('/create-session', usersApi.createSession);     //IMPORTANT : Setting up jwt authentication is so easy as compared to the traditional local-strategy. This route does not require any middleware, the passport.isAuthenticated() is not required here, instead when we call this route, if the credentials is correct, we are simply send in the json web token that consists of all the necessary credentials.

module.exports = router;