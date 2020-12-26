const express = require('express');
const router = express.Router();

const passport = require('passport');
const searchApi = require('../../../controllers/api/v1/search_api');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  searchApi.generalSearch
);

module.exports = router;
