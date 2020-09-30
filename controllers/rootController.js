const express = require('express')
var router = express.Router()
const comment=require('../models/comment')
const blogPosts=require('../models/blogPosts')
const seo=require('./seoMeta');

//serving static files
router.use(express.static('public'));


// home route
router.get('/', function (req, res) {
    //get recent blogs
    blogPosts.find((err,posts)=>{
        if(err) console.log(err);
        res.render('index',{isLoggedIn: req.session.isLoggedIn,posts:posts,seo:seo});
    })
    .limit(5)
    .sort({timestamp:'desc'})
    .select('title timestamp timeToRead category imageurl slug');
    
})


module.exports = router;