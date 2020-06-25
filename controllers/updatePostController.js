const express = require('express')
const blogpost = require('../models/blogPosts');


const seo = require('./seoMeta');

var router = express.Router()
router.use(express.static('public'));

//Multer upload
const upload = require('./multerUpload');

//newPost
router.get('/:id', (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }

    //If loggen in find the blog from database and serve it to newpost page
    var id = req.params.id;
    blogpost.findById(id, (err, post) => {
        res.render('updatePost', { isLoggedIn: req.session.isLoggedIn, seo: seo, post: post });
    });
})

//updating the blog post
router.post('/:id', upload.single('img'), (req, res) => {
    var id = req.params.id;
    blogpost.findById(id, (err, post) => {
        // Once we found the post by id to update we'll feed in the new values
        //making tags array
        var tags = (req.body.tags).split(','); 
        post.title= req.body.title,
        post.body=req.body.postBody,
        post.timeToRead=req.body.timeToRead,
        post.category= req.body.category,
        post.author= req.body.author,
        post.aboutAuthor=req.body.aboutAuthor,
        post.shortDescription= req.body.description,
        post.imageurl= req.file.filename,
        post.tags= tags

        post.save((err) => {
            if (err) console.log(err);
            console.log("Updated Post");
            res.redirect('/')
        });
    });
});

module.exports = router;
