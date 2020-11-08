const express = require('express');
const router = express.Router();
const passport = require('../config/passport-local-strategy');

const friendshipController = require('../controllers/friendship_controller');


router.post('/add-remove', passport.checkAuthentication, friendshipController.addRemove);


module.exports = router;