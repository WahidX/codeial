const User = require('../models/users');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const crypto = require('crypto');
const Reset_Token = require('../models/reset_token');
const queue = require("../config/kue");
const resetCodeMailWorker = require("../workers/resetToken_mail_worker");


module.exports = {
    profile : function(req, res) {
        
        User.findById(req.params.id, function(err, user){
            if(err){console.log('Err: ',err);return;}

            return res.render('profile', {
                title: 'Profile',
                profile_user: user
            });
        })
    },

    updateUser : async function(req, res){
        if(req.user.id == req.params.id){
            try{
                let user = await User.findById(req.params.id);
                User.uploadedAvatar(req, res, function(err){
                    if(err){console.log("Err: ",err);return;}
                    
                    user.email = req.body.email;
                    user.name = req.body.name;

                    if(req.file){
                        if(user.avatar){
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }

                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();
                    return res.redirect('back');
                });
                

            }catch(err) {
                console.log('Err: ',err);
                return;
            }
            
        }
        else{
            req.flash('error', 'Unauthorized');
            return res.status(401).send('Unauthourized');
        }
    },

    login : function(req, res) {
        if(req.isAuthenticated()){
            return res.redirect('/user/profile/');
        }

        return res.render('login', {
            title : 'Login'
        });

    },

    signup : function(req, res) {
        if(req.isAuthenticated()){
            return res.redirect('/user/profile/');
        }

        return res.render('signup', {
            title : 'Signup'
        });
    },

    createUser : function(req, res) {
        
        if(req.body.password != req.body.confirm_password){
            req.flash('error',"Password doesn't match!");
            console.log("password doesn't match");
            return res.redirect('back');
        }

        User.findOne({email:req.body.email}, function(err, user){
            if(err){console.log('Error in getting email');return;}

            if(!user) {
                User.create({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name
                }, function(err,newUser){
                    if(err){console.log("Error in creating new user");return;}
                    console.log('New user created');
                    return res.redirect('/user/login');
                })
            }
            else{
                console.log('Email alreay exists');
                return res.redirect('back');
            }
        })

    },

    createSession : function(req, res) {
        req.flash('success', 'Logged in');
            
        return res.redirect('/');
    },

    destroySession: function(req, res) {
        req.logout();
        req.flash('success', 'Logged out');
        return res.redirect('/');
    },

    // These are for reset and changing password
    // reset password comes here
    confirmPassword: function(req, res){
        return res.render('confirm-password', {
            title: 'Confirm Password'
        });
    },

    // gets the password or mail
    resetPassword: async function(req, res){
        // Grabbing the user
        let user;
        if(req.isAuthenticated()){
            // its a reset request
            user = req.user;
            if (user.password !== req.body.old_password){
                req.flash('error', 'Wrong password');
                return res.redirect('back');
            }
        }
        else{
            // its a forget password request
            user = await User.findOne({email: req.body.email});
            if(!user){
                req.flash('error', 'Email is not registered');
                return res.redirect('back');
            }
        }
        // Generating the token and storing it in DB
        const token = crypto.randomBytes(20).toString('hex').slice(0,4);
        // Deleting user's previous tokens
        Reset_Token.deleteOne({ user: user._id }, function (err) {
            if(err){ console.log("Err: ",err); return; }
        });
        // creating new token entry
        let resetToken = await Reset_Token.create({
            user: user.id,
            access_token: token,
            isvalid: true
        });
        
        resetToken = await resetToken.populate('user','name email').execPopulate();

        let job = queue.create('resetmails', resetToken).save(function(err){
            if(err){console.log("Err: ",err);return;}
        });
        // Mail sent and DB updated
        
        // TODO: Store user for forget password

        return res.render('reset-code',{
            title: 'Reset Code'
        });
    },
    
    checkToken: async function (req, res) {
        

        return res.redirect('back');
    }

};