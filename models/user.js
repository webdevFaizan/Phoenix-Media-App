const mongoose = require('mongoose');

// The user model will have a new field by the name of avatars, which will consist the reference of the uploaded image, and the path will be used to store the path for file uploaded in the local storage or the bucket in which it will be stored.
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');    // I think path.join will join the current path with this path so that we do not need to hard code the exact path of the profile picture being uploaded.

const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true        
    },
    password : {
        type : String,
        required : true
    },
    avatar: {
        type: String
    }
},{
    timestamps : true
});



const User = mongoose.model('User', userSchema);
module.exports=User;