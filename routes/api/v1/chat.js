const express = require('express');
const router = express.Router();

const passport = require('passport');
const chatApi = require('../../../controllers/api/v1/chats_api');

router.get(
  '/all-chats',
  passport.authenticate('jwt', { session: false }),
  chatApi.getChats
);

router.get(
  '/messages/:roomid',
  passport.authenticate('jwt', { session: false }),
  chatApi.getMessages
);

module.exports = router;
