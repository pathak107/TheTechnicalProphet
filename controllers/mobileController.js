const express = require('express')
var router = express.Router()
const blogPosts = require('../models/blogPosts')
const path = require('path');

//Serving static files
router.use(express.static('public'));

// To send blog posts to mobile
router.get('/blogPosts', function (req, res) {
    //get all articles
    blogPosts.find((err, posts) => {
        if (err) console.log(err);
        res.json(
            posts);
    })
        .sort({ timestamp: 'desc' })
        .select('-body');

})

//sending images to mobile application
router.get('/:imageurl', function (req, res) {
    //get the image of a particular post

    var imagepath = path.join(__dirname, '../public/uploads/' + req.params.imageurl)
    res.sendFile(imagepath)
})

module.exports = router