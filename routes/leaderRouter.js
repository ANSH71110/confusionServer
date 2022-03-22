var express=require('express');
var bodyParser=require('body-parser');
const mongoose=require('mongoose');
const authenticate=require('../authenticate');
const cors=require('./cors');

const Leaders=require('../models/leaders');

var leaderRouter=express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.statusCode=200;})
.get(cors.cors,(req,res,next)=>{
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        console.log('Leader created:',leader);
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported for /leaders/');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{res.statusCode=200;})
.get(cors.cors,(req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported for /leaders/'
    +req.params.leaderId);   
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));    
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

/*
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
});*/
module.exports=leaderRouter;