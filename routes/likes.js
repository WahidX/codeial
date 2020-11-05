const express = require('express');
const router = express.Router();
const passport = require('../config/passport-local-strategy');

const likeController = require('../controllers/like_controller');


router.post('/toggle', passport.checkAuthentication, likeController.toggleLike);


module.exports = router;