require('dotenv').config()
const express = require('express');
const app = express();
const compression = require('compression')
app.use(compression())
const https = require('https');

//on page seo
const seo=require('./controllers/seoMeta');

const fs=require('fs');
var session = require('express-session')
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoDBStore = require('connect-mongodb-session')(session);
var store = new mongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions'
})

const privateKey= fs.readFileSync('blog-istemanipal.com.key');
const certificate = fs.readFileSync('blog-istemanipal.com.pem')


//Serving Static files
app.use(express.static('public'));
//setting bodyparser
// app.use(bodyParser.urlencoded({ extended: true }));

//Ejs initialization
app.set('view engine', 'ejs');

//Connection with database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true, useUnifiedTopology:
    true
}, (err) => {
  if (err) console.log(err);
  console.log("Connected to Database");
});

//session intialization
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    //remeber to set this to true when in production
    secure: true,
    maxAge:60*60*1000,
    httpOnly:true
  }
}))


//importing Controllers
const rootController = require('./controllers/rootController')
const authController = require('./controllers/authController');
const articleController = require('./controllers/articleController')
const contactController = require('./controllers/contactController')
const newPostController = require('./controllers/newPostController')
const mobileController = require('./controllers/mobileController')
const updatePostController=require('./controllers/updatePostController');



//handling routes
app.use('/', rootController)
app.use('/auth', authController);
app.use('/articles', articleController);
app.use('/update',updatePostController);
app.use('/contact', contactController);
app.use('/newPost', newPostController);
app.use('/mobile', mobileController)
// about route
app.get('/about', function (req, res) {
  res.render('about', { isLoggedIn: req.session.isLoggedIn,seo:seo });
});

//404 page
app.use((req, res) => {
  res.send('404 error');
})


const port = process.env.PORT || 443

// //Always change this while deploying it to serer
// app.listen(3000, () => {
//   console.log('Server Started');
// });

https.createServer({
  cert:certificate,
  key:privateKey
},app).listen(port);