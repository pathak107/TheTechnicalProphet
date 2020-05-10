const express = require('express')
var router = express.Router()
const fs = require('fs');
const blogPosts = require('../models/blogPosts')
const comment = require('../models/comment')
//Serving static files
router.use(express.static('public'));

const upload = require('./multerUpload');

// /artcile rooute
router.get('/', function (req, res) {
    //get all articles

    //Apply pagination
    blogPosts.find((err, posts) => {
        if (err) console.log(err);
        res.render('blog', { isLoggedIn: req.session.isLoggedIn, posts: posts });
    })
        .select('title timestamp shortDescription imageurl')
        .sort({ timestamp: 'desc' });

})

// /article/product_id routes to get single article
router.get('/:postID', function (req, res) {
    //get all tags and recent blogs
    //get single articles and its comments using id
    blogPosts.findOne({ _id: req.params.postID }, (err, post) => {
        if (err) console.log(err);

        //fetching comments of this post
        comment.find({ _postid: req.params.postID }, (err, comments) => {
            
            
            //fetching recent Blogs
            blogPosts.find((err, recentPosts) => {
                if (err) console.log(err);

                //finally rendering the article page
                res.render('blog-single', {
                    isLoggedIn: req.session.isLoggedIn,
                    post: post,
                    comments: comments,
                    recentPosts: recentPosts
                });

            }).select('title timestamp imageurl')
                .sort({ timestamp: 'desc' })
                .limit(3);

        }).sort({ timestamp: 'desc' })
            .select('-_postid')
    })
        .select('title body author aboutAuthor imageurl tags')

})
router.post('/:postID', upload.none(), (req, res) => {
    //for posting comments
    let post_id = req.params.postID;
    var newComment = new comment({
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        _postid: post_id,
    })
    newComment.save((err) => {
        if (err) console.log(err)
        res.redirect('/articles/' + post_id);
    });
})

router.delete('/:postID', (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }

    blogPosts.findOne({ _id: req.params.postID }, (err, post) => {
        if (err) console.log(err)
        fs.unlink('./public/uploads/' + post.imageurl, function (err) {
            if (err) console.log(err);
            // if no error, file has been deleted successfully
            console.log('File deleted!');

            //delete post
            blogPosts.deleteOne({ _id: req.params.postID }, (err) => {
                if (err) console.log(err);
                res.json({ message: "success" });
            })
        });
    }).select('imageurl');
});

//deleting comment
router.delete('/comment/:commentID', (req, res) => {
    if (req.session.isLoggedIn == undefined) {
        return res.redirect('/auth/login');
    }
    //delete post
    comment.deleteOne({ _id: req.params.commentID }, (err) => {
        if (err) console.log(err);
        console.log("Comment Deleted")
        res.json({ message: "success" });
    })

});

module.exports = router