const express = require('express')
var router = express.Router()
const fs = require('fs');
const blogPosts = require('../models/blogPosts')
const comment = require('../models/comment')

//seo
const seo = require('./seoMeta');

//Serving static files
router.use(express.static('public'));

const upload = require('./multerUpload');

const POSTS_PER_PAGE = 6;

// /artcile rooute
router.get('/', async function (req, res) {
    //get all articles
    //Apply pagination
    let page = +req.query.page || 1;
    let query;
    if (req.query.category != undefined) {
        query = { category: req.query.category }
    } else {
        query = {};
    }

    let totalArticles;
    blogPosts.find(query).countDocuments((err, articles) => {
        if (err) console.log(err);
        totalArticles = +articles
        blogPosts.find(query, (err, posts) => {
            if (err) console.log(err);
            res.render('blog',
                {
                    isLoggedIn: req.session.isLoggedIn,
                    posts: posts,
                    seo: seo,
                    currentPage:page,
                    hasNextPage:page*POSTS_PER_PAGE<totalArticles,
                    nextPage:page+1,
                    prevPage:page-1,
                    hasPrevPage:page>1
                });
        })
            .skip((page - 1) * POSTS_PER_PAGE)
            .limit(POSTS_PER_PAGE)
            .select('title timestamp shortDescription imageurl')
            .sort({ timestamp: 'desc' });

    })
})


// /article/post_id routes to get single article
router.get('/:postID', function (req, res) {
    //get all tags and recent blogs
    //get single articles and its comments using id
    blogPosts.findOne({ _id: req.params.postID }, (err, post) => {
        if (err) console.log(err);

        //Updating the views of the post as someone visited the page
        post.views += 1;
        post.save((err) => {
            if (err) console.log(err);
        });


        //fetching comments of this post
        comment.find({ _postid: req.params.postID }, (err, comments) => {


            //fetching recent Blogs
            blogPosts.find((err, recentPosts) => {
                if (err) console.log(err);

                //setting the seo data
                seo.image = "https://blog.istemanipal.com/mobile/" + post.imageurl;
                seo.description = post.shortDescription;
                seo.siteDescription = post.shortDescription;
                seo.title = post.title;
                seo.url = "https://blog.istemanipal.com/articles/" + post._id;

                //finally rendering the article page
                res.render('blog-single', {
                    isLoggedIn: req.session.isLoggedIn,
                    post: post,
                    comments: comments,
                    recentPosts: recentPosts,
                    seo: seo
                });

            }).select('title timestamp imageurl')
                .sort({ timestamp: 'desc' })
                .limit(3);

        }).sort({ timestamp: 'desc' })
            .select('-_postid')
    })
        .select('title body author shortDescription aboutAuthor imageurl tags views')



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