const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

const User = require('../models/users');

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret,
};

passport.use(
  new JWTstrategy(opts, function (payload, done) {
    User.findById(payload._id, function (err, user) {
      if (err) {
        console.log('Err: ', err);
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      } else {
        done(null, false);
      }
    });
  })
);

module.exports = passport;
