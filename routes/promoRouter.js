var express=require('express');
var bodyParser=require('body-parser');

var promoRouter=express.Router();

promoRouter.route('/')
.all( (req,res,next)=>{
    res.statusCode=200;
    res.setHeader('context-type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all the promotions to you!');
})
.post((req,res,next)=>{
    res.end('Will add the promotion: '+req.body.name+
    ' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported for /promotions/');
})
.delete((req,res,next)=>{
    res.end('Deleting all the promotions!');
});
promoRouter.route('/:promoId/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('context-type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send the promotion:'+req.params.promoId+' to you!')
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported for /promotion/promoId'
    +req.params.promoId);   
})
.put((req,res,next)=>{
    res.write('Updating the promotion: '+req.params.promoId);
    res.end('\nWill add the promotion: '+req.body.name+
    ' with details: '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting the promotion:'+req.params.promoId);
});
module.exports=promoRouter;