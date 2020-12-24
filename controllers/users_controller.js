const User = require('../models/users');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const crypto = require('crypto');
const Reset_Token = require('../models/reset_token');
const queue = require('../config/kue');
const Friendship = require('../models/friendship');
const bcrypt = require('bcrypt');

module.exports = {
  profile: async function (req, res) {
    try {
      let user = await User.findById(req.params.id);

      //check if user's friend or not
      let match1, match2;
      match1 = await Friendship.find({
        from_user: req.user.id,
        to_user: req.params.id,
      });

      if (match1.length === 0) {
        match2 = await Friendship.find({
          from_user: req.params.id,
          to_user: req.user.id,
        });
      }

      let isFriend = false;
      if (match1.length > 0 || match2.length > 0) {
        isFriend = true;
      }
      console.log('isFried: ', isFriend);

      return res.render('profile', {
        title: 'Profile',
        profile_user: user,
        isFriend: isFriend,
      });
    } catch (err) {
      req.flash('error', 'Invalid Request');
      console.log('Err : ', err);
      return res.redirect('back');
    }
  },

  updateUser: async function (req, res) {
    if (req.user.id == req.params.id) {
      try {
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req, res, function (err) {
          if (err) {
            console.log('Err: ', err);
            return;
          }

          user.email = req.body.email;
          user.name = req.body.name;

          if (req.file) {
            if (user.avatar) {
              fs.unlinkSync(path.join(__dirname, '..', user.avatar));
            }

            user.avatar = User.avatarPath + '/' + req.file.filename;
          }
          user.save();
          return res.redirect('back');
        });
      } catch (err) {
        console.log('Err: ', err);
        return;
      }
    } else {
      req.flash('error', 'Unauthorized');
      return res.status(401).send('Unauthourized');
    }
  },

  login: function (req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/user/profile/');
    }

    return res.render('login', {
      title: 'Login',
    });
  },

  signup: function (req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/user/profile/');
    }

    return res.render('signup', {
      title: 'Signup',
    });
  },

  createUser: async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
      req.flash('error', "Password doesn't match!");
      console.log("password doesn't match");
      return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, async function (err, user) {
      if (err) {
        console.log('Error in getting email');
        return;
      }

      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        User.create(
          {
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
          },
          function (err, newUser) {
            if (err) {
              console.log('Error in creating new user');
              return;
            }
            console.log('New user created');
            return res.redirect('/user/login');
          }
        );
      } else {
        console.log('Email alreay exists');
        return res.redirect('back');
      }
    });
  },

  createSession: function (req, res) {
    req.flash('success', 'Logged in');

    return res.redirect('/');
  },

  destroySession: function (req, res) {
    req.logout();
    req.flash('success', 'Logged out');
    return res.redirect('/');
  },

  // These are for reset and changing password
  // reset password comes here

  forgetPassword: function (req, res) {
    return res.render('confirm_email', {
      title: 'Confirm Email',
    });
  },

  checkPassword: function (req, res) {
    if (req.user.password !== req.body.old_password) {
      req.flash('error', 'Incorrect password!');
      return res.redirect('back');
    }

    return res.redirect(`/user/send-reset-link/${req.user.id}`);
  },

  resetPassword: function (req, res) {
    return res.render('confirm_password', {
      title: 'Confirm Password',
    });
  },

  checkEmail: async function (req, res) {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash('error', 'Email not registered!');
      return res.redirect('back');
    }

    return res.redirect(`/user/send-reset-link/${user.id}`);
  },

  sendResetLink: async function (req, res) {
    // check user id
    let user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'Invalid URL!');
      return res.redirect('back');
    }

    // invalidating user's previous valid tokens
    Reset_Token.updateMany(
      { user: user._id, isvalid: 'true' },
      { $set: { isvalid: 'false' } },
      function (err) {
        console.log('Err: ', err);
        return;
      }
    );

    // Generating new token and storing it in DB
    const token = crypto.randomBytes(20).toString('hex');

    let resetToken = await Reset_Token.create({
      user: user.id,
      access_token: token,
      isvalid: true,
    });

    resetToken = await resetToken
      .populate('user', '_id name email')
      .execPopulate();

    let job = queue.create('resetmails', resetToken).save(function (err) {
      if (err) {
        console.log('Err: ', err);
        return;
      }
    });
    // Mail sent and DB updated
    req.flash('success', 'Reset link sent to mail');

    // TODO: in EJS resend mail option
    return res.redirect('back');
  },

  resetLinkCheck: async function (req, res) {
    let user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'Invalid Request');
      return res.redirect('/');
    }
    let token = await Reset_Token.findOne(
      { user: user.id, isvalid: 'true' },
      {},
      { sort: { created_at: -1 } }
    );

    console.log('Token: ', token);
    if (token.access_token !== req.params.token) {
      req.flash('error', 'Invalid Request');
      return res.redirect('/');
    }

    req.flash('success', 'Now Change Password');

    return res.render('update-password', {
      title: 'New Password',
      id: user._id,
    });
  },

  updatePassword: async function (req, res) {
    let user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }

    if (req.body.new_password !== req.body.confirm_password) {
      req.flash('error', "Passwords didn't match");
      return res.redirect('back');
    }

    // Check if the user made the update request
    let token = await Reset_Token.findOne({
      user: req.params.id,
      isvalid: true,
    });
    if (!token) {
      console.log('No reset_token is valid for ID ', req.params.id);
      req.flash('error', 'Invalid request');
    }

    token.isvalid = 'false';
    token.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    user.save();

    req.flash('success', 'Password changed Successfully');
    if (req.isAuthenticated()) {
      req.logout();
    }
    return res.redirect('/user/login');
  },
};
