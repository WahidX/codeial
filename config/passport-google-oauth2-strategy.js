const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');


passport.use(new googleStrategy({
        clientID: '665614270427-ovu837sfno1j16jbr2bf29n6tka4e2sm.apps.googleusercontent.com',
        clientSecret: 'LZ_XpeAbgh3eoomr0PVtX-vH',
        callbackURL: 'http://localhost:8000/user/auth/google/callback'
    }, 
    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){ console.log('Err: ',err); return;}

            console.log(profile);

            if(user){
                return done(null, user);
            }
            else {
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){ console.log('Err: ',err); return;}

                    return done(null, user);
                });
            }
        });
    }
));