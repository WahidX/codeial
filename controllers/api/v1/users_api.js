const User = require('../../../models/users');
const jwt = require('jsonwebtoken');


module.exports.createSession = async function(req, res) {
    try{
        let user = await User.findOne({ email: req.body.email });
        
        let p1 = user.password;
        let p2 = req.body.password;
        // for some reason user.password != req.body.password was giving wrong result so used p1,p2

        if(!user || p1!=p2){
            return res.json(422, {
                message : "Incorrect email/password"
            });
        }

        return res.json(200,{
            message: "Sign in successful, here's your token",
            data : {
                token: jwt.sign(user.toJSON(), 'secret_key', {expiresIn: '10000'})
            }
        })
    } catch(err) {
        console.log("Err : ",err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}