const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a method, instead of using module.exports we could use exports.newComment = ...something
exports.resetPassword = (token,email) => {
    let url = `http://localhost:8000/users/${token}`
    let htmlString = nodeMailer.renderTemplate({url: url}, '/reset_password/reset_password_mailer.ejs');
    nodeMailer.transporter.sendMail({
       from: 'backup.errorcode@gmail.com',
       to: email,      //IMPORTANT : Since we are going to use the user email of the person who has made the comment, we need to know before hand the populated value of the user.email, this is why when this method is called from the comments controller methods then in that case the value of comment must not be in the form of reference but its value must be populated, so that no issue in accessing the email id of user.
       subject: "Click the link to reset the Password.",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err); return;
        }
        return;
    });
}
