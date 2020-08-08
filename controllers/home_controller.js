const Post = require("../models/post");
const User = require("../models/users");


module.exports = {
    home : function(req, res) {
        return res.render('home', {
            title : "Home"
        });
    }
    
    

};

