var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var user = new Schema({

    "firstName": String,
    "lastName": String,
    "email": String,
    "phone": Number,
    "password": String,
    "email_verified": Boolean,
    "phone_verified": Boolean,
    "OTP_Mobile": Number,
    "emailCode": String
});

module.exports = mongoose.model('user', user);
