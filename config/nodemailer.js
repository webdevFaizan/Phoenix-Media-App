const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')


// IMPORTANT : async..await is not allowed in global scope, must use a wrapper
// async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
//   let testAccount = nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport, this is the part that tells us how the communication is going to take place.
  let transporter = nodemailer.createTransport({
    service : 'gmail',
    host: "smtp.gmail.com",     //As developers, the gmail sending as a service must be very very fast and reliable, so this is kind of google's dedicated server to make this service optimized.    
    port: 587,      //This port is for TLS protocol, and for the sending of mail, this service is the most secure one. And TLS means transport security layer.
    // secure: false, // true for 465, false for other ports
    secure : true,      //since we are not going to do 2 factor authentication.
    auth: {     //Setting up of authentication is necessary as you do not want to send mail from random users to random users. Authentication also helps the service providers to keep a track of how much mail have you sent over the time period. 
      user: 'backup.errorcode@gmail.com',   //Email Id that would be used to send the mail to the users.
      pass: 'ffcbeokpupzlxtau',   //This is the actual password, this should not be kept like this, instead is should be kept in the process.env file. But the point is we could send mail from our account using this password.
    },
    tls: {
        rejectUnauthorized: false		
    }

  });


// This method is only going to be called in the case when we want a particular template to be rendered using the ejs view engine. But if we are not using a template engine and want to send the mail automatically, then this could also be done, a method will run sendMail() that will be useful to directly send the mail.
// IMPORTANT : This function defines the html for when we have to send the email and the template for those mails is placed in the ../views/mailers folder
let renderTemplate = (data, relativePath) => {      //Relative path is being provided from the file where we are going to call this method.
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
         if (err){console.log('error in rendering template', err); return}
         
         mailHTML = template;       //IMPORTANT : This template variable is going to store a html, after being rendered from the ejs view engine template, and in mailHTML will be returned now.
        }
    )
    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}