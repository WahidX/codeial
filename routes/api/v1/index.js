const express = require('express');
const router = express.Router();

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
router.use('/likes', require('./likes'));
router.use('/friends', require('./friendship'));
router.use('/search', require('./search'));
router.use('/chat', require('./chat'));

router.get('/', function (req, res) {
  return res.send('API is working fine');
});

module.exports = router;
