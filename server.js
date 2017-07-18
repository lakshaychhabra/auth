var express = require('express');
var bodyParser = require('body-parser');
var port = 3000 || process.env.PORT;
var mongoose = require('mongoose');
var router = express.Router();
var config = require('./config.js');
var studentSchema = require('./models/studentSchema');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var sendEmail = require('./email.js');
var randomOtp = require('./random.js').num;
var randomEmail = require('./random.js').str;
var otp = randomOtp()
var emCode = randomEmail()

var hashPass
const saltRounds = 10;
mongoose.connect(config.mlab)
var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
        res.send("Nothing")
    })
    //registeration form of user
app.post('/register', function(req, res) {
    bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
        if (err) { console.log(err) } else {
            var student = new studentSchema({
                "firstName": req.body.fName,
                "lastName": req.body.lName,
                "email": req.body.Email,
                "phone": req.body.Phone,
                "password": hash,
                "email_verified": false,
                "phone_verified": false,
                "OTP_Mobile": otp,
                "emailCode": emCode

            })
            student.save(function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    sendEmail(req.body.Email, emCode)
                    res.json("successfully registered")
                }
            })
        }
    })
})

//taking login from user
app.post('/login', function(req, res) {
    studentSchema.findOne({ "email": req.body.email1 }, function(err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            res.json({ success: false, message: 'User not found.' })
        } else {


            bcrypt.compare(req.body.pass, user.password, function(err, result) {
                if (result == true) {

                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 86440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                } else {
                    res.json("wrong Id password");
                }

            })


        }
    })
})

//middleware to check the token
app.use(function(req, res, next) {
        var token = req.param('token') || req.headers['x-access-token'];
        //decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    })
    //routes of verification
app.get('/verify/email', function(req, res) {
            var verify_email = require('./emailverification.js')(req,res)
            var email2 = req.headers['em'];
            var code2 = req.headers['code'];
            // console.log('_____________')

            // studentSchema.find({ "email": email2 }, function(err, users) {
            //     if (!users) {
            //         res.json({ success: false, message: 'Verification failed. User not found.' })
            //     } else {
            //     	console.log('place1')
            //     	console.log(users)
            //     	console.log(code2 )
            //         if (users[0].emailCode == code2) {
            //         	console.log('yo')
            //             studentSchema.findOneAndUpdate({ "email": email2 }, { $set: { "email_verified": true } }, { new: true }, function(err, doc) {
            //                 if (err) {
            //                     console.log("Something wrong when updating data!");
            //                 } else {
            //                     res.json({ success: true, message: 'Email verified.', user: email2 })
            //                 }
            //             })
            //         } else {
            //         	console.log('no')
            //             res.json({ success: false, message: 'Verification failed. Wrong verification code.' })
            //         }
            //     }
            // })
   })
            // //testing start of token

            // app.get('/users', function(req, res) {
            //     studentSchema.find({}, function(err, user) {
            //         res.json(user);
            //     });
            // });

            // app.get('/check', function(req, res) {
            //     res.json(req.decoded);
            // });
            // //testing close



            app.listen(port, function() {
                console.log('server is running at 3000')
            })
