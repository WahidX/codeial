const express = require('express');
const router = express.Router();

const passport = require('passport');
const userApi = require('../../../controllers/api/v1/users_api');

router.post('/create-user', userApi.createUser);

router.post('/create-session', userApi.createSession);

// passport.authenticate('jwt', { session: false }),

router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  userApi.updateUser
);

router.post(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    res.status(200).json({
      message: 'noice',
      data: {
        user: req.user,
      },
    });
  }
);

module.exports = router;
