module.exports.profile = function(req,res){
    res.render('user_profiles',{
        'title' : 'User Profile Page'
    })
}