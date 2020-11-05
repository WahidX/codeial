const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');


router.get('/', homeController.home);
router.use('/user', require('./users'));
router.use('/post', require('./post'));
router.use('/comment', require('./comment'));
router.use('/api', require('./api'));
router.use('/likes', require('./likes'));


console.log('router loaded');

module.exports = router;