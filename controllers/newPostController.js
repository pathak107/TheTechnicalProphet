const express = require('express')
const blogpost = require('../models/blogPosts');
const comment = require('../models/comment');
var router = express.Router()
router.use(express.static('public'));

//Multer upload
const upload=require('./multerUpload');

//newPost
router.get('/',(req,res)=>{
    if(req.session.isLoggedIn==undefined){
        return res.redirect('/auth/login');
    }
    res.render('newpost',{isLoggedIn: req.session.isLoggedIn});
})
router.post('/',upload.single('img'),(req,res)=>{
    //making tags array
    var tags=(req.body.tags).split(',');
    var post = new blogpost({
        title: req.body.title,
        body: req.body.postBody,
        timeToRead: req.body.timeToRead,
        category: req.body.category,
        author: req.body.author,
        aboutAuthor: req.body.aboutAuthor,
        shortDescription: req.body.description,
        imageurl: req.file.filename,
        tags:tags
    });
    post.save((err)=>{
        if(err) console.log(err);
        console.log("Inserted Post");
        res.redirect('/')
    })

    
});


module.exports = router;

