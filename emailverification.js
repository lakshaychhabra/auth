var mongoose = require('mongoose')
var studentSchema = require('./models/studentSchema');

var verification = function(req, res) {
    var email = req.param('email');
    var code = req.param('code')||req.headers['code'];

    studentSchema.find({ "email": email }, function(err, user) {
        if (!user) {
            res.json({ success: false, message: 'Verification failed. User not found.' })
        } else {
            if (user[0].emailCode == code) {
                studentSchema.findOneAndUpdate({ "email": email }, { $set: { email_verified: true } }, { new: true }, function(err, doc) {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    } else {
                        res.json({ success: true, message: 'Email verified.', user: username })
                    }
                })
            } else {
                res.json({ success: false, message: 'Verification failed. Wrong verification code.' })
            }
        }
    })




}
module.exports = verification;
