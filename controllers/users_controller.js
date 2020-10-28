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

    forgetPassword: function(req, res){
        return res.render('confirm_email', {
            title: 'Confirm Email'
        });
    },

    checkPassword: function(req, res){
        if (req.user.password !== req.body.old_password){
            req.flash('error', 'Incorrect password!');
            return res.redirect('back');
        }

        return res.redirect(`/user/send-reset-link/${req.user.id}`);
    },

    resetPassword: function(req, res){
        return res.render('confirm_password', {
            title: 'Confirm Password'
        });
    },

    checkEmail: async function(req, res){
        let user = await User.findOne({email:req.body.email});

        if(!user){
            req.flash('error', 'Email not registered!');
            return res.redirect('back');
        }
        
        return res.redirect(`/user/send-reset-link/${user.id}`);
    },

    sendResetLink: async function(req, res){
        // check user id
        let user = await User.findById(req.params.id);
        if(!user){
            req.flash('error', 'Invalid URL!');
            return res.redirect('back');
        }

        // invalidating user's previous valid tokens
        Reset_Token.updateMany(
            {user: user._id, isvalid: "true"}, 
            {$set: { isvalid: "false" }}, 
            function(err){ console.log("Err: ",err); return; }
        );

        // Generating new token and storing it in DB
        const token = crypto.randomBytes(20).toString('hex');

        let resetToken = await Reset_Token.create({
            user: user.id,
            access_token: token,
            isvalid: true
        });
        

        resetToken = await resetToken.populate('user','_id name email').execPopulate();

        let job = queue.create('resetmails', resetToken).save(function(err){
            if(err){console.log("Err: ",err);return;}
        });
        // Mail sent and DB updated
        req.flash('success', 'Reset link sent to mail');

        // TODO: in EJS resend mail option
        return res.redirect('back');
    }

// From mail update password  
 
};