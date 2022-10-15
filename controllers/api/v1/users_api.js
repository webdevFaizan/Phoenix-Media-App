const User = require('../../../models/user');
const jwt = require('jsonwebtoken');        //This is the json webtoken that will be used to create an encrypted web token and this is a web token not created to store in the local machine, it will make the jsonwebtoken encrypted and decrypted each time we transact or hit any endpoint.




module.exports.createSession= async function(req,res){
    try{
        let user = await User.findOne({email : req.body.email});        //We will take the email as user name from the form that we try to fill in our sign in page, then we simply find if any user with this name is present or not. If yes then we proceed.
        if(!user || user.password!=req.body.password){      //If the user does not exist, we will not render anything for now or now go to any other route, we simply output the message in json format.
            return res.status(422).json({
                message : "Invalid Username or Password."
            })
        }
        return res.status(200).json({       //If the user name is correct, then we pass on the json webtoken along with the email and some other information that would be regarding the expiry or the webtoken. Every time any kind of transaction occurs between client and server, this json webtoken will be encrypted and decrypted as per requirement and this is why we do not need to keep it inside any database. But remember there is no session being considered, as we restart the server this json webtoken will be lost. This was also the same issue in the earlier version of the code.
            message : "Sign In successful, here is the json web token, please keep it safe",
            data : {
                token : jwt.sign(user.toJSON(), 'phoenix', {expiresIn: 100000})        //IMPORTANT : This is the main function that encrypts the token to webtoken. user.toJSON() is the main method to properly encrypt the data into header.payload.signature format, this will be done in a format of json webtoken and the key for this encryption is 'phoenix', and the webtoken will be expired in 100 seconds.
            }
        })
    }
    catch(err){
        console.log('********', err);
        return res.status(500).json({
            message: "Some interal server error occured."
        })
    }
};