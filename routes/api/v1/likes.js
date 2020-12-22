const express = require('express');
const router = express.Router();
const passport = require('passport');

const likeApi = require('../../../controllers/api/v1/likes_api');

router.post(
  '/toggle',
  passport.authenticate('jwt', { session: false }),
  likeApi.toggleLike
);


module.exports = router;
