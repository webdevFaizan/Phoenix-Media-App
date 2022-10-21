const Like = require("../models/like");
const Post =  require("../models/post");
const Comment = require('../models/comment');


module.exports.toggleLike = async function(req, res){
    try{
        // likes/toggle/?id=abcdef&type=Post, this is going to be the url and from this we will extract the id and type of the content where this like has been made. Why only id and type is important? Because it is enough to uniquely identify the like in the array of likes.
        let likeable;
        let deleted = false;

        if (req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        // if a like already exists then delete it
        if (existingLike){
            likeable.likes.pull(existingLike._id);      //IMPORTANT : We maintain the data of the any like or any relation in two manner, one in its own model and the other in its relation. So like is saved inside the like model as well in the post/comment on which the like was made. This will delete the like from post/comment.
            likeable.save();        //IMPORTANT : Since we are partially deleting the data from the db and it is like updating the db, so we need to run the save method.
            existingLike.remove();      //This will delete like from the like model array.
            deleted = true;
        }else{
            // else make a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            deleted = false;
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.json(200, {      //Here the return method is behaving like an API, we use this API to make async call so that we do not need to refresh the page, and asycn await works beautifully.
            message: "Request successful!",
            data: {
                deleted: deleted        //IMPORTANT : Since this is the api, which means this data will be used to communicate the deletion data. This will be used to tell the front end that the like is to be deleted or not.
            }
        })
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}