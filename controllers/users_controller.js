const User = require('../models/users');


module.exports = {
    profile : async function(req, res) {
        try{
            let profile_user = await User.findById(req.params.id);

            return res.render('profile', {
                title: 'Profile',
                profile_user: user
            });
        }catch(err){
            console.log('Err: ',err);
        }
    },

    updateUser : function(req, res){
        if(req.user.id == req.params.id){
            User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
                if(err){console.log("err in finding user for update",err);return;}

                return res.redirect('back');
            })
        }
        else{
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
    }
};