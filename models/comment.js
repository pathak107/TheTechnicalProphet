const mongoose=require('mongoose');
var commentSchema= new mongoose.Schema({
    name:String,
    email:String,
    comment:String,
    timestamp:{ type: Date, default: Date.now },
    _postid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blogPost'
    }
});

module.exports= mongoose.model('comment',commentSchema);


