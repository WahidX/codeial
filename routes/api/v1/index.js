const express = require('express');
const router = express.Router();

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/likes', require('./likes'));
router.use('/friends', require('./friendship'));
router.use('/search', require('./search'));

module.exports = router;
