const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller')



router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'))
router.use('/comments', require('./comments'));

router.use('/api',require('./api'));
// This will tell the current index.js file that an api versioning system has been introduced and it has its own index.js file, also api has it own version, which have its own index.js files.

module.exports = router;