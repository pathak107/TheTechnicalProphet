const express = require('express')
var router = express.Router()

const seo=require('./seoMeta');

//send grid mailer
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);

router.use(express.static('public'));

// contact route
router.get('/', function (req, res) {
    res.render('contact',{isLoggedIn: req.session.isLoggedIn,seo:seo});
});

module.exports = router;