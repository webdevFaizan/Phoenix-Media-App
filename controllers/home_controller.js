module.exports.home = function(req, res){
    // res.send("home controller");
    res.render('home',{
        'title' : 'Home Page'
    })
}