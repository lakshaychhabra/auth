var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('./config.js')

var mailAccountUser = 'pietraman@piet.co.in'
var mailAccountPassword = 'hackraman'

// main work is done by this smtpTransport so at new signup the value of to toEmailAddress should be
// equal to the Users[0].email  you the know the best.
var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: mailAccountUser,
        pass: mailAccountPassword
    }
}))

var sendEMail = function(email,code) {
  var mail = {
    from: mailAccountUser,
    to: email,
    subject: "Welcome To Auth",
    text: 'http://localhost:3000/verify/email/'+email+'/'+code
  }
  transport.sendMail(mail, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Email sent: " + response);
    }
    transport.close();
  });
}

module.exports = sendEMail
