const passport = require('passport');
const JWTstrategy = require("passport-jwt"),Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require('../models/users');

// Pending