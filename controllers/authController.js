const express = require('express')
var router = express.Router()
router.use(express.static('public'));

//Multer upload
const upload=require('./multerUpload');

// handles /login
router.get('/login', function (req, res) {
  res.render('login', { loginStatus: "Enter to Authenticate" });
})

//Authentication
router.post('/login',upload.none(),(req, res) => {
    if(req.body.userName===process.env.ADMIN_USER && req.body.password===process.env.ADMIN_PASS)
    {
        req.session.isLoggedIn=true;
        res.redirect('/');
    }
    else{
        res.render('login.ejs', { loginStatus: "Wrong Email or Password. Try Again! " });
    }
    
});

router.get('/logout',(req,res)=>{
    
    req.session.destroy((err)=>{
        if(err) console.log(err);
        console.log('logged out');
        res.redirect('/');
    })
})

module.exports = router;




