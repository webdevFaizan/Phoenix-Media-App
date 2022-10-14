const express = require('express');
const router = express.Router();

const postsApi = require('../../../controllers/api/v1/index');

// router.use('/v1', require('./v1'));
router.use('/', postsApi.index);

module.exports = router;