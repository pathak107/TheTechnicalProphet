const multer = require('multer');

//Multer storage settings
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')    
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime()+"-"+file.originalname);
  }
})
var upload = multer({ storage: storage })
module.exports=upload;