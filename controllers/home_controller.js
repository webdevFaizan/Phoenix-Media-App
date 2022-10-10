module.exports.home = function(req, res){
    // res.send("home controller");
    res.render('home',{     //This file 'home.ejs' will be automatically looked upon in the views folder becuase we have set the view engine to be searched in that file itself.
        'title' : 'Home Page'   
    })
}