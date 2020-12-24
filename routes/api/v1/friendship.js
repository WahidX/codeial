const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendsAPI = require('../../../controllers/api/v1/friends_api');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  friendsAPI.getFriends
);

router.post(
  '/add-remove',
  passport.authenticate('jwt', { session: false }),
  friendsAPI.addRemoveFriend
);

module.exports = router;
