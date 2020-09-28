const express = require('express')
const blogpost = require('../models/blogPosts');
const comment = require('../models/comment');

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
    Category.find((err,categories)=>{
        if(err)console.log(err)
        res.render('newpost',{
            isLoggedIn: req.session.isLoggedIn,
            seo: seo,
            categories:categories
        });
    })
    
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

    //// Mailing to all the users who have their emails registered
    // comment.find((err, comments) => {
    //     const msg = {
    //         to: comments.email,
    //         from: 'istemanipal@gmail.com',
    //         subject: 'The Technical Prophet | ' + req.body.title,
    //         text: 'The Technical Prophet has uploaded a new post checkout now!',
    //         html: '<a href="https://blog-istemanipal.herokuapp.com/" ><strong>' + req.body.title + '</strong></a>',
    //     };
    //     sgMail
    //         .send(msg)
    //         .then(() => { }, error => {
    //             console.error(error);

    //             if (error.response) {
    //                 console.error(error.response.body)
    //             }
    //         });
    // }).select('email');

});

router.get('/allCategories',(req,res)=>{
    Category.find((err,categories)=>{
        if(err){
            return res.status(500).json({
                success:false,
                message:"Some error occured in retrieval from database"
            })
        }
        else{
            return res.status(200).json({
                success:true,
                message:"Successfull",
                data:categories
            })
        }
    })
})
router.get('/addCategory', (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }
    res.render('addCategory', {
        message: "Add new category name.",
        seo: seo,
        isLoggedIn: req.session.isLoggedIn
    })
})

router.post('/addCategory',upload.none(), (req, res) => {
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
        return res.redirect('/newPost')
    })
})


module.exports = router;

