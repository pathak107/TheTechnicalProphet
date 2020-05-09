require('dotenv').config()
const express = require('express');
const app = express();
var session = require('express-session')
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');


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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))


//importing Controllers
const rootController=require('./controllers/rootController')
const authController = require('./controllers/authController');
const articleController=require('./controllers/articleController')
const contactController=require('./controllers/contactController')
const newPostController=require('./controllers/newPostController')



//handling routes
app.use('/',rootController)
app.use('/auth', authController);
app.use('/articles', articleController);
app.use('/contact', contactController);
app.use('/newPost', newPostController);
// about route
app.get('/about', function (req, res) {
    res.render('about',{isLoggedIn: req.session.isLoggedIn});
});



//404 page
app.use((req, res) => {
  res.send('404 error');
})
app.listen(3000 || process.env.PORT, () => {
  console.log('Server Started');
});