const mongoose=require('mongoose');
var blogPostSchema= new mongoose.Schema({
    title:String,
    body:String,
    timestamp: { type: Date, default: Date.now },
    timeToRead:Number,
    category:String,
    author:String,
    aboutAuthor:String,
    shortDescription:String, 
    imageurl:String
});
module.exports=mongoose.model('blogPost',blogPostSchema);


