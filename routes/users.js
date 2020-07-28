const express = require('express');
const router = express.Router();

const userController = require('../controllers/users_controller');

router.get('/profile', userController.profile);
router.get('/login', userController.login);
router.get('/signup', userController.signup);
router.post('/create-user', userController.createUser);
router.post('/login-user', );



module.exports = router;