const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/users_controller');

router.get('/profile', passport.checkAuthentication, userController.profile);
router.get('/login', userController.login);
router.get('/signup', userController.signup);
router.post('/create-user', userController.createUser);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/user/login'}
), userController.createSession);
router.get('/sign-out', userController.destroySession);


module.exports = router;