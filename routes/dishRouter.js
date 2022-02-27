var express=require('express');
var bodyParser=require('body-parser');

var dishRouter=express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all( (req,res,next)=>{
    res.statusCode=200;
    res.setHeader('context-type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all the dishes to you!');
})
.post((req,res,next)=>{
    res.end('Will add the dish: '+req.body.name+
    ' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported for /dishes/');
})
.delete((req,res,next)=>{
    res.end('Deleting all the dishes!');
});
dishRouter.route('/:dishId/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('context-type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send the dish:'+req.params.dishId+' to you!')
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported for /dishes/dishId'
    +req.params.dishId);   
})
.put((req,res,next)=>{
    res.write('Updating the dish: '+req.params.dishId);
    res.end('\nWill add the dish: '+req.body.name+
    ' with details: '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting the dish:'+req.params.dishId);
});
module.exports=dishRouter;