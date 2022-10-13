//IMPORTANT : Remember one thing, the noty.js will not work without the flash messages, so the connect-flash is going to be used before we could use flash messages. And the flash messages requires the session cookie, so all of these things are required for notyjs to work.
module.exports.setFlash = function(req, res, next){     //IMPORTANT : The centralised middleware for flash message is being used over and over again so that we could pass different messages as per requirement, if some error occurs we output it, if we encounter success we output it.
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}