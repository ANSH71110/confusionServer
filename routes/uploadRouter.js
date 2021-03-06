var express=require('express');
var bodyParser=require('body-parser');
const authenticate=require('../authenticate');
var multer=require('multer');
const cors=require('./cors');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images');
    },

    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

const imageFileFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload image files only!'),false);
    }
    cb(null,true);
};

const upload=multer({storage:storage,fileFilter:imageFileFilter})

var uploadRouter=express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.statusCode=200;})
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operation not supported for /imageUpload/');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported for /imageUpload/');
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'),(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','apllication/json');
    res.json(req.file);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('DELETE operation not supported for /imageUpload/');
});

module.exports=uploadRouter;