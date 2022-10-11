const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/profile', usersController.profile);
router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);

// router.post('/create-session', usersController.createSession);
router.post('/create-user', usersController.createUser);


module.exports = router;