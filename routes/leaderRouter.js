var express=require('express');
var bodyParser=require('body-parser');

var leaderRouter=express.Router();

leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('context-text','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all the leaders to you!');
})
.post((req,res,next)=>{
    res.end('Will add the leaders: '+req.body.name+
    ' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported for /leaders/');
})
.delete((req,res,next)=>{
    res.end('Deleting all the leaders!');
});
leaderRouter.route('/:leaderId/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('context-type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send the leader:'+req.params.leaderId+' to you!')
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported for /leaders/leaderId'
    +req.params.promoId);   
})
.put((req,res,next)=>{
    res.write('Updating the leader: '+req.params.leaderId);
    res.end('\nWill add the leader: '+req.body.name+
    ' with details: '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting the leader:'+req.params.leaderId);
});
module.exports=leaderRouter;