const User = require('../models/users');

module.exports = {
    profile : function(req, res) {
        console.log(req.cookies);
        if (req.cookies.user_id){
            User.findById(req.cookies.user_id, function(err, user){
                if(err){console.log('Error in finding user from userID'); return}

                if(user){
                    return res.render('profile',{
                        title: 'Profile',
                        user:{
                            name: user.name,
                            email: user.email
                        }
                    });
                }
                else{
                    console.log('Faulty Cookie');
                    return
                }
            })
        }
        else{
            return res.redirect('/user/login');
        }
    },

    login : function(req, res) {
        return res.render('login', {
            title : 'Login'
        });

    },

    signup : function(req, res) {
        return res.render('signup', {
            title : 'Signup'
        });
    },

    createUser : function(req, res) {
        
        if(req.body.password != req.body.confirm_password){
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
                    if(err){console.log("Error in creating new user");return}
                    console.log('New user created');
                    return res.redirect('back');
                })
            }
            else{
                console.log('Email alreay exists');
                return res.redirect('back');
            }
        })
    },

    createSession : function(req, res) {

        User.findOne({email: req.body.email}, function(err, user) {
            if(err) {
                console.log('Error in finding user');
                return;
            }

            if (user) {
                if(user.password == req.body.password){
                    res.cookie('user_id', user.id);
                    return res.redirect('/user/profile');
                }
                else {
                    console.log('Password incorrect');
                    return res.redirect('back');
                }
            }
            else {
                console.log('No user found');
                return res.redirect('/user/signup');
            }
        })
    },

    deleteSession: function(req, res) {
        if(req.cookies.user_id){
            res.cookie();
            //Delete cookie not working
            console.log('jjjjj',res.cookies);
        }
        res.redirect('/user/profile');
    }
};