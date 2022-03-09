var express=require('express');
var bodyParser=require('body-parser');
const mongoose=require('mongoose');

const Dishes=require('../models/dishes');

var dishRouter=express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next)=>{
    Dishes.find({})
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dishes);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish created:',dish);
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported for /dishes/');
})
.delete((req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
dishRouter.route('/:dishId/')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported for /dishes/'
    +req.params.dishId);   
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));    
})
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
module.exports=dishRouter;
/*dishRouter.route('/')
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
module.exports=dishRouter;*/