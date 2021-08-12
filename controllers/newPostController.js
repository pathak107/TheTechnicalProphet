const express = require('express')
const blogpost = require('../models/blogPosts');
const Email = require('../models/emailList');
const mailer = require('./nodemailer')

// Html Sanitizer
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);


const seo = require('./seoMeta');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);

var router = express.Router()
router.use(express.static('public'));

//Multer upload
const upload = require('./multerUpload');
const Category = require('../models/category');

//newPost
router.get('/', (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }
    Category.find((err, categories) => {
        if (err) console.log(err)
        res.render('newpost', {
            isLoggedIn: req.session.isLoggedIn,
            seo: seo,
            categories: categories
        });
    })

})
router.post('/', upload.single('img'), (req, res) => {
    //making tags array
    var tags = (req.body.tags).split(',');
    var post = new blogpost({
        title: req.body.title,
        body: DOMPurify.sanitize(req.body.postBody),
        timeToRead: req.body.timeToRead,
        category: req.body.category,
        author: req.body.author,
        aboutAuthor: req.body.aboutAuthor,
        shortDescription: req.body.description,
        imageurl: req.file.filename,
        tags: tags
    });
    post.save((err,newPost) => {
        if (err) console.log(err);
        console.log("Inserted Post");
        res.redirect('/')

        // Mailing to all the users who have their emails registered
        Email.find((err, emails) => {
            if(err) console.log(err)

            //send email
            const mailOptions = {
                from: "The Technical Prophet <contactus@istemanipal.com>", // sender address
                to: emails,
                subject: `The Technical Prophet | ${req.body.title}`, // Subject line
                html: `<h2>The Technical Prophet just posted a new article. Click the link below to checkout.</h2>
                    <a href="https://blog.istemanipal.com/articles/single/${newPost.slug}/${newPost._id}"> ${req.body.title}</a>
                    <p>We'll keep you posted for further updates.</p>`, // plain text body
            };
            mailer.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }).select('email');
    })
});

router.get('/allCategories', (req, res) => {
    Category.find((err, categories) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Some error occured in retrieval from database"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                message: "Successfull",
                data: categories
            })
        }
    })
})
router.get('/addCategory', (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }
    Category.find((err, categories) => {
        if (err) {
            return res.render('addCategory', {
                message: "Some error occured in loading the categories. Please try again later",
                seo: seo,
                isLoggedIn: req.session.isLoggedIn,
                categories: []
            })
        }
        else {
            res.render('addCategory', {
                message: "Add new category name.",
                seo: seo,
                isLoggedIn: req.session.isLoggedIn,
                categories: categories
            })
        }
    })
})

router.post('/addCategory', upload.none(), (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }
    newCategory = new Category({
        name: req.body.category
    })
    newCategory.save((err, newCategory) => {
        if (err) {
            return res.render('addCategory', {
                message: "Some error occured in creating new category. Make sure this category doesn't already exists.",
                seo: seo,
                isLoggedIn: req.session.isLoggedIn
            })
        }
        return res.redirect('/newPost/addCategory')
    })
})

router.get('/delete/:catID', (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }
    Category.findById(req.params.catID, (err, category) => {
        if (err) {
            return res.render('addCategory', {
                message: "Some error occured in deleting the category.",
                seo: seo,
                isLoggedIn: req.session.isLoggedIn
            })
        }

        category.remove((error) => {
            if (error) {
                return res.render('addCategory', {
                    message: "Some error occured in deleting the category.",
                    seo: seo,
                    isLoggedIn: req.session.isLoggedIn
                })
            }
            else {
                return res.redirect('/newPost/addCategory')
            }
        })

    })
})

module.exports = router;

