const express = require('express')
var router = express.Router()
const bodyParser=require('body-parser');

const seo=require('./seoMeta');

//setting bodyparser
router.use(bodyParser.urlencoded({ extended: true }));

//send grid mailer
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);

router.use(express.static('public'));

// contact route
router.get('/', function (req, res) {
    res.render('contact',{isLoggedIn: req.session.isLoggedIn,seo:seo});
});
router.post('/',(req,res)=>{
    //Send the message send by user to istemanipal@gmail.com by the same email id as this is the regitered one
    console.log(req.body);
})

module.exports = router;