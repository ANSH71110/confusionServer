var express=require('express');
var bodyParser=require('body-parser');
const mongoose=require('mongoose');
const authenticate=require('../authenticate');
const cors=require('./cors');

const Favourites=require('../models/favourite');

var favouriteRouter=express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.statusCode=200;})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    Dishes.find({})
    .populate('user')
    .populate('dishes')
    .then((favourites)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(favourites);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne(req.user._id)
    .then((favourite)=>{
        if(favourite){
            for(var i=0;i<req.body.length;i++){
                if(favourite.dishes.indexOf(req.body[i]._id)===-1){
                    favourite.dishes.push(req.body[i]._id)
                }
            }
            favourite.save()
            .then((favourite)=>{
                console.log('Favourite created:', dish);
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(favourite);
            },(err)=>next(err));
        }
        else{
            favourite.create({"user":req.user._id,"dishes":req.user.body})
            favourite.save()
            .then((favourite)=>{
                console.log('Favourite created:', dish);
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(favourite);
            },(err)=>next(err));
        }       
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported for /favourites/');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findByIdAndRemove({"user":req.user._id})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.statusCode=200;})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operatoin is not supported for /favourites/'+req.params.dishId);
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne(req.user._id)
    .then((favourite)=>{
        if(favourite){
            if (favourite.dishes.indexOf(req.body[i]._id) === -1) {
                favourite.dishes.push(req.body[i]._id)
            }
            favourite.save()
            .then((favourite)=>{
                console.log('Favourite created:', dish);
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(favourite);
            },(err)=>next(err));
        }
        else{
            favourite.create({"user":req.user._id,"dishes":req.user.body})
            favourite.save()
            .then((favourite)=>{
                console.log('Favourite created:', dish);
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(favourite);
            },(err)=>next(err));
        }       
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne(req.user._id)
    .then((favorite)=>{
        if(favorite){
            if(favorite.dishes.indexOf(req.params.dishId)>=0){
                favorite.dishes.id(req.params.dishId).remove()
                .then((favorite)=>{
                    console.log('Favorite Deleted ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(favorite);
                },(err)=>next(err));
            }
            else{
                err=new Error('Dish '+req.params.dishId+' not found!')
                err.status = 404;
                next(err);
            }
        }
        else{
            err=new Error('Favourite not found!')
            err.status = 404;
            next(err);
        }
        
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports=favouriteRouter;