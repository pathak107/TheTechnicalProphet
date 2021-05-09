const express = require('express')
var router = express.Router()
const blogPosts = require('../models/blogPosts')
const comment = require('../models/comment');
const path = require('path');

//Serving static files
router.use(express.static('public'));

// To send blog posts to mobile
router.get('/blogPosts', function (req, res) {
    //get all articles
    if (req.query.page == undefined) {
        blogPosts.find((err, posts) => {
            if (err) console.log(err);
            res.json(
                posts);
        })
            .sort({ timestamp: 'desc' })
            .select('-body')
    }
    else {
        const POSTS_PER_PAGE = +req.query.size||5;
        let page = +req.query.page || 1;
        blogPosts.find((err, posts) => {
            if (err) console.log(err);
            res.json(
                posts);
        })
            .sort({ timestamp: 'desc' })
            .select('-body')
            .skip((page - 1) * POSTS_PER_PAGE)
            .limit(POSTS_PER_PAGE);
    }


})


router.use('/single/:postID', express.static('public'));
router.get('/single/:postID',(req, res)=> {

    //get all tags and recent blogs
    //get single articles and its comments using id
    blogPosts.findById(req.params.postID, (err, post) => {
        if (err) console.log(err);

        //Updating the views of the post as someone visited the page
        post.views += 1;
        post.save((err) => {
            if (err) console.log(err);
        });

        //fetching comments of this post
        comment.find({ _postid: req.params.postID }, (err, comments) => {


            //fetching recent Blogs
            blogPosts.find(async (err, recentPosts) =>{
                if (err) console.log(err);

                //finally rendering the article page
                return res.render('mobileView', {
                    post: post,
                    comments: comments,
                    recentPosts: recentPosts,
                });

            }).select('_id title timestamp imageurl slug timeToRead')
                .sort({ timestamp: 'desc' })
                .limit(3);

        }).sort({ timestamp: 'desc' })
            .select('-_postid')
    })
        .select('_id title body author shortDescription aboutAuthor imageurl tags views slug')
})


//sending images to mobile application
router.get('/:imageurl', function (req, res) {
    //get the image of a particular post

    var imagepath = path.join(__dirname, '../public/uploads/' + req.params.imageurl)
    res.sendFile(imagepath)
})


module.exports = router