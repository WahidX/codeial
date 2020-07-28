const User = require('../models/users');


module.exports = {
    profile : function(req, res) {
        return res.end('<h1>Profile accessed</h1>');
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

    }
};