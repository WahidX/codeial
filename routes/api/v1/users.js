const express = require('express');
const router = express.Router();

const passport = require('passport');
const userApi = require('../../../controllers/api/v1/users_api');

router.post('/create-user', userApi.createUser);

router.post('/create-session', userApi.createSession);

// passport.authenticate('jwt', { session: false }),

router.patch(
  '/update',
  passport.authenticate('jwt', { session: false }),
  userApi.updateUser
);

router.patch(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  userApi.changePassword
);

// Email confirmation apis
router.get('/econfirmation/:jwt', userApi.confirmEmail);
router.get(
  '/resend-econfirm',
  passport.authenticate('jwt', { session: false }),
  userApi.resendConfirmationMail
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
