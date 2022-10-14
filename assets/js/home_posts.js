{
    //IMPORTANT : Initially we were allowing the post to be submitted by the traditional methods, the methods inlcuded the port being submitted by the notmal request response cycle, and it required the page to be refreshed, but we want to do this asynchronously, this is exactly where ajax comes in. First of all we will prevent any default behaviour of the post Creation phase and then we will submit the form asynchronously.
    let createPost= function(){
        let newPostForm= $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type : 'POST',
                url : '/posts/create',      //This is the end point that will be hit for the ajax request. This is the same url that is being hit when the post is being sent through the form, but that action is blocked now, and the post is being sent as the ajax request.
                data : newPostForm.serialize(),     //This converts the post data into json by itself, like the key value pair. This will be helpful in sending the data in the next success object.
                success : function(data){
                    console.log(data);
                    let newPost = newPostDom(data.data.post);                    
                    $('#posts-list-container>ul').prepend(newPost);     //We are selecting the ul inside the posts-list-contianer. Since it is exactly where we want to add our post, also the > sign in all about selecting the next children.
                    deletePost($(' .delete-post-button', newPost));     //This method is going to extract the .delete-post-button from the newPost and in turn it will send it to the function, the delete link. Remeber there has to be a space in ' .delete-post-button'
                    new Noty({
                        theme: 'relax',
                        text: "Post Added",
                        type: 'success',
                        layout: 'bottomRight',
                        timeout: 1500                        
                    }).show();
                },
                error : function(e){
                    console.log(e);
                }
            })
        })}


    // method to delete a post from DOM
    let deletePost = function(deleteLink){      //This function is simply attatching the click listener in the format of the ajax and asynchronous manner and this will only be executed only when we click on it.
        $(deleteLink).click(function(e){    //When we click on the link since it is an a tag, it will try to go to that href, but instead it will be prevented.
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),    //This will take the ajax request to this link, and in the controller function of this link we will check for the req.xhr object which will in turn return the post_id and we will remove it from the front end, all of this will be done with out refreshing.
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();   //This selection using the postid makes the post selection easy. This is the main reason why we use the id tag this way, it makes the post selection easy. And then we directly delete it by adding remove button.
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'bottomRight',
                        timeout: 1500                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    let newPostDom = function(post,req){
        return $(`<li id="post-${post._id}">
                    <p>                    
                        ${post.content}
                        <br>
                        <small>
                            ${post.user.name}
                        </small>                        
                        <div class="postDeleteButton">                            
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">Delete Post</a>
                        </div>                        
                    </p>
                    <div class="post-comments">                        
                            <form action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Type Here to add comment..." required>
                                <input type="hidden" name="post" value="${post._id}" >                                
                                <input type="submit" value="Add Comment">
                            </form>                        
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">                                
                            </ul>
                        </div>
                    </div>                
                </li>                
            `);
    }        

    createPost();       //This function is simply adding an event handler to the post submit button, and that button will simply add the ajax type of request so that it will not go through the normal request response cycle by refreshing the page, instead it will go through the ajax request.
}