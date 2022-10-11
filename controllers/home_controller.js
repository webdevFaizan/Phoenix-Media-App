module.exports.home = function(req, res){
    console.log(req.cookies);       //cookie always comes from the request, and the request is always raised by the client, so when ever this function is being accessed by accessing the route that is calling this function, the request will consists of the cookie.
    //And if you wish to alter the contents of the cookie, then this should be done in the response, since all the processing will be done in this function itself and then after the proper processing of the data, cookie will or any other data will be sent back to the response.
    res.cookies('user_id',23);      //Now this cookie will show up in the Application tab of the inspect elements, where the value will be changed to 23.
    res.render('home',{     //This file 'home.ejs' will be automatically looked upon in the views folder becuase we have set the view engine to be searched in that file itself.
        'title' : 'Home Page',
        'name' : 'Please Login First'
    })
}