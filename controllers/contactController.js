const express = require('express')
var router = express.Router()
router.use(express.static('public'));

// contact route
router.get('/', function (req, res) {
    res.render('contact',{isLoggedIn: req.session.isLoggedIn});
});
router.post('/', (req, res) => {
    //impement mailing mechanism
})

module.exports = router;