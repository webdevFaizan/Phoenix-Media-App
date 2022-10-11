module.exports.home = function(req, res){
    console.log(req.cookies);       //IMPORTANT : cookie always comes from the request, and the request is always raised by the client, so when ever this function is being accessed by accessing the route that is calling this function, the request will consists of the cookie.
    //And if you wish to alter the contents of the cookie, then this should be done in the response, since all the processing will be done in this function itself and then after the proper processing of the data, cookie will or any other data will be sent back to the response.
    res.cookie('user_id',1223);      //IMPORTANT : Now this cookie will show up in the Application tab of the inspect elements, where the value will be changed to 23.
    // This above line of code also tells us that the cookie can be altered from the server side, or it could be altered from the client side, since any behaviour tracking could be done by the cookie, and if on the client side you have a change in behaviour then the cookie will be changed.

    res.render('home',{     //This file 'home.ejs' will be automatically looked upon in the views folder becuase we have set the view engine to be searched in that file itself.
        'title' : 'Home Page',
        'name' : 'Please Login First'
    })
}