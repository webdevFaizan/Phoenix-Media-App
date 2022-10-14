module.exports.index = function(req,res){
    return res.status(200).json({
        message : "v2 api working fine."
    })
}