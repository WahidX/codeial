const express = require('express');
const router = express.Router();

const passport = require('passport');
const authApi = require('../../../controllers/api/v1/auth_api');


router.post('/create-user', authApi.createUser);
router.post('/create-session', authApi.createSession);
router.patch(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  authApi.changePassword
);
// Email confirmation apis
router.get('/econfirmation/:jwt', authApi.confirmEmail);
router.get(
  '/resend-econfirm',
  passport.authenticate('jwt', { session: false }),
  authApi.resendConfirmationMail
);


module.exports = router;