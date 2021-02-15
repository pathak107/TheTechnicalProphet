const express = require('express')
var router = express.Router()
router.use(express.static('public'));

const seo = require('./seoMeta')

const { encrypt, decrypt } = require('./encrypter');
const mailer= require('./nodemailer');

//Multer upload
const upload = require('./multerUpload');
const Email = require('../models/emailList');

// handles /login
router.get('/login', function (req, res) {
    res.render('login', { loginStatus: "Enter to Authenticate" });
})

//Authentication
router.post('/login', upload.none(), (req, res) => {
    if (req.body.userName === process.env.ADMIN_USER && req.body.password === process.env.ADMIN_PASS) {
        req.session.isLoggedIn = true;
        res.redirect('/');
    }
    else {
        res.render('login.ejs', { loginStatus: "Wrong Email or Password. Try Again! " });
    }

});

router.get('/mailSubscription', upload.none(), (req, res) => {
    return res.render('mailSubscription', {
        isLoggedIn: req.session.isLoggedIn,
        seo: seo,
        message: "Enter your email."
    })
})
router.post('/mailSubscription', upload.none(), (req, res) => {
    const code = encrypt(req.body.email);
    const mailOptions = {
        from: "The Technical Prophet <contactus@istemanipal.com>", // sender address
        to: req.body.email,
        subject: `The Technical Prophet | Email verification`, // Subject line
        html: `<h2>The Technical Prophet wants to verify your email id. Please click the link below to verify your email.</h2>
            <a href="https://blog.istemanipal.com/auth/mailVerification?code=${code}">Verify your email.</a>`, // plain text body
    };
    mailer.sendMail(mailOptions, (err) => {
        if (err) {
            return res.render('mailSubscription', {
                isLoggedIn: req.session.isLoggedIn,
                seo: seo,
                message: "Some error occured in sending the email. Please check if it's a valid email or not."
            })
        }
        return res.render('mailSubscription', {
            isLoggedIn: req.session.isLoggedIn,
            seo: seo,
            message: `We have sent you a verification email. Please click on the link in email to verify.`
        })
    })

})

router.get('/mailVerification', (req, res) => {
    var emailID= decrypt(req.query.code);
    const email = new Email({
        email: emailID,
    })
    email.save((err, newEmail) => {
        if (err) {
            return res.render('mailSubscription', {
                isLoggedIn: req.session.isLoggedIn,
                seo: seo,
                message: "Some error occured. Please check if it's a valid email or you're not already subscribed."
            })
        }
        return res.render('mailSubscription', {
            isLoggedIn: req.session.isLoggedIn,
            seo: seo,
            message: `Thanks for verification. We'll keep you posted at ${newEmail.email}`
        })
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        console.log('logged out');
        res.redirect('/');
    })
})

module.exports = router;




