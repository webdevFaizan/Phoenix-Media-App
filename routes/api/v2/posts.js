const express = require('express');
const router = express.Router();

const postsApi = require('../../../controllers/api/v2/index');

router.use('/', postsApi.index);

module.exports = router;