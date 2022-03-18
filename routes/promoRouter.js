var express=require('express');
var bodyParser=require('body-parser');
const mongoose=require('mongoose');
const authenticate=require('../authenticate');

const Promotions = require('../models/promotions');

var promoRouter=express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next)=>{
    Promotions.find({})
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(promotions);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promotion)=>{
        console.log('Promotion created:',promotion);
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported for /promotions/');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

promoRouter.route('/:promotionId')
.get((req,res,next)=>{
    Promotions.findById(req.params.promotionId)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported for /promotions/'
    +req.params.promotionId);   
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promotionId,{
        $set:req.body
    },{new:true})
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));    
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


/*
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
});*/
module.exports=promoRouter;