module.exports.index = function(req,res){
    return res.status(200).json({
        message : "v1 api working fine."
    })
}