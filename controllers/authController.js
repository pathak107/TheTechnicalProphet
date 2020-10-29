const express = require('express')
var router = express.Router()
router.use(express.static('public'));

const seo=require('./seoMeta')

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
    const email=new Email({
        email:req.body.email
    })
    email.save((err,newEmail)=>{
        if(err){
            return res.render('mailSubscription', {
                isLoggedIn: req.session.isLoggedIn,
                seo: seo,
                message: "Some error occured. Please check if it's a valid email or you're not already subscribed."
            })
        }
        return res.render('mailSubscription', {
            isLoggedIn: req.session.isLoggedIn,
            seo: seo,
            message: `Thanks. We'll keep you posted at ${newEmail.email}`
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




