const mongoose=require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

var blogPostSchema= new mongoose.Schema({
    title:String,
    slug: { type: String, slug: "title" },
    body:String,
    timestamp: { type: Date, default: Date.now },
    timeToRead:Number,
    category:String,
    author:String,
    aboutAuthor:String,
    shortDescription:String, 
    imageurl:String,
    tags:Array,
    views:{type:Number, default:0},
});
module.exports=mongoose.model('blogPost',blogPostSchema);


