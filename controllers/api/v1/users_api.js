const User = require('../../../models/users');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');
const bcrypt = require('bcrypt');

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    let isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(422).json({
        message: 'Incorrect email/password',
      });
    }

    return res.json(200, {
      message: "Sign in successful, here's your token",
      data: {
        token: jwt.sign({ _id: user._id }, env.jwt_secret, {
          expiresIn: '10000000',
        }),
      },
    });
  } catch (err) {
    console.log('Err : ', err);
    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.createUser = async function (req, res) {
  try {
    if (req.body.password !== req.body.confirm_password) {
      return res.status(422).json({
        message: "Passwords didn't match!",
      });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(422).json({
        message: 'Email is already registered',
      });
    }
    console.log('user: ', user);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    return res.status(200).json({
      message: 'User created Successfully',
      success: true,
      data: {
        user: newUser,
        token: jwt.sign({ _id: newUser._id }, env.jwt_secret, {
          expiresIn: '10000000',
        }),
      },
    });
  } catch (err) {
    console.log('Err:  ', err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.updateUser = async function (req, res) {
  if (!req.body.email || !req.body.name) {
    return res.status(404).json({
      message: 'Wrong update content',
    });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user && user.id !== req.user.id) {
      return res.status(404).json({
        message: 'Email already registered',
      });
    }
    let changed = false;

    if (req.user.name !== req.body.name) {
      req.user.name !== req.body.name;
      changed = true;
    }

    if (req.user.email !== req.body.email) {
      req.user.email !== req.body.email;
      changed = true;
    }

    if (changed) {
      await req.user.save();
    }

    return res.status(200).json({
      message: 'user updated successfully',
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(501).json({
      message: 'Internal server error',
    });
  }
};
