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

// This is found on the docs of multer npm js
let storage = multer.diskStorage({      //multer.disStorage will be used to save on the same machine, this means it will be saved on the same server where we have all the files saved.
    // The destination will be defined by joining the current directory name and then the path of the folder where it will be stored.
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));    //The second argument always takes up the path in the string format, this simply means, we could provide the string path in a broken up fahsion.
    }, 
    filename: function (req, file, cb) {         //We need to define the file name of the file that user uploads, this would be reuqired since there could be two users with the same file name. And this is why we will either use random number or we would be using the timestamp of milliseconds using Date.now() mehtod that would be unique in itself. Date.now() is an epoch time,it will be used to find the relative time as compared to the computer clock.
      cb(null, file.fieldname + '-' + Date.now());      //This is going to make the filename even much more unique, since we are taking the timefactor as well as we are taking into account the random number that is being generated.
    }
  });
//At this point we have only defined the storage variable and not used it.


//Statics methods - I have explained this in detail in my nodejs.docx file. But in short we can simply say that these are like the static methods of class, accessible to all the Schema, and not just one instance of schema.
userSchema.statics.uploadedAvatar = multer({storage:  storage}).single('avatar');
//In the storage property of multer, the value of the object storage is added to multer. .single('avatar') means only one single instance of avatar will be uploaded, since we do not want to store multiple avatars for single user.
userSchema.statics.avatarPath = AVATAR_PATH;         //This will make it available to all the objects of userSchema that the path to access the avatarPath is this. Also since we are exporting User, it could be visible anywhere in the whole project, this is to make sure, we are looking at the right directory.
// This avatarPath is being sent with the User schema of the model, this will help us in accessing the avatarPath outside of this file in the other files. And we have accessed this file in the update functionality of users_controller.js

const User = mongoose.model('User', userSchema);
module.exports=User;