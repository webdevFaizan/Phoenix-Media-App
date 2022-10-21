const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({    
    user: {
        type:  mongoose.Schema.Types.ObjectId,      //This will actually contain the id of the user that is the owner of the post but later during the retrieval of the post we will be able to populate to find the actual user that is the owner, not just its id. 
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.ObjectId,
        require: true,
        refPath: 'onModel'      //Here refPath means a path has to be defined on which the path of the Model is going to be applied, which in this case means we will look at the enum of onModel which would be Post, Comment.
    },
    // this field is used for defining the type of the liked object since this is a dynamic reference
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']       //IMPORTANT : If I remove this value then any model could have like, but we have mentioned this in the back end to make extra sure that Post and Comment are the only field going to have like.
    }
},{
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;