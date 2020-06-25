const express = require('express')
const blogpost = require('../models/blogPosts');
const comment = require('../models/comment');

const seo=require('./seoMeta');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);

var router = express.Router()
router.use(express.static('public'));

//Multer upload
const upload = require('./multerUpload');

//newPost
router.get('/', (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }
    res.render('newpost', { isLoggedIn: req.session.isLoggedIn ,seo:seo});
})
router.post('/', upload.single('img'), (req, res) => {
    //making tags array
    var tags = (req.body.tags).split(',');
    var post = new blogpost({
        title: req.body.title,
        body: req.body.postBody,
        timeToRead: req.body.timeToRead,
        category: req.body.category,
        author: req.body.author,
        aboutAuthor: req.body.aboutAuthor,
        shortDescription: req.body.description,
        imageurl: req.file.filename,
        tags: tags
    });
    post.save((err) => {
        if (err) console.log(err);
        console.log("Inserted Post");
        res.redirect('/')
    })

    comment.find((err, comments) => {
        const msg = {
            to: comments.email,
            from: 'istemanipal@gmail.com',
            subject: 'The Technical Prophet | ' + req.body.title,
            text: 'The Technical Prophet has uploaded a new post checkout now!',
            html: '<a href="https://blog-istemanipal.herokuapp.com/" ><strong>' + req.body.title + '</strong></a>',
        };
        sgMail
            .send(msg)
            .then(() => { }, error => {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            });
    }).select('email');

});


module.exports = router;

