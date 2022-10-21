const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,      //This will actually contain the id of the user that is the owner of the post but later during the retrieval of the post we will be able to populate to find the actual user that is the owner, not just its id. 
        ref: 'User'
    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,      //And same would be true for the comments as well, and the post and user has 1:1 relationship, but the post and comments has 1:N relationship.
            ref: 'Comment'
        }
    ],
    likes : [
            {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Like'
        }
    ]
},{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;