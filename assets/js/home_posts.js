{
    //IMPORTANT : Initially we were allowing the post to be submitted by the traditional methods, the methods inlcuded the port being submitted by the notmal request response cycle, and it required the page to be refreshed, but we want to do this asynchronously, this is exactly where ajax comes in. First of all we will prevent any default behaviour of the post Creation phase and then we will submit the form asynchronously.
    let createPost= function(){
        let newPostForm= $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type : 'POST',
                url : '/posts/create',
                data : newPostForm.serialize(),
                success : function(data){
                    console.log(data);
                },
                error : function(e){
                    console.log(e);
                }
            })
        })}

    createPost();       //This function is simply adding an event handler to the post submit button, and that button will simply add the ajax type of request so that it will not go through the normal request response cycle by refreshing the page, instead it will go through the ajax request.
}