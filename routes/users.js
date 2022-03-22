var express = require('express');
const mongoose=require('mongoose');
const { route } = require('.');
var router = express.Router();
const User=require('../models/user');
const passport=require('passport');
const authenticate=require('../authenticate');
const cors=require('./cors');

/* GET users listing. */
router.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,function(req, res, next) {
  User.find({})
  .then((users)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(users);
  },(err)=>next(err))
  .catch((err)=>next(err))
});

router.post('/signup',cors.corsWithOptions,(req,res,next)=>{
  User.register(new User({username:req.body.username}),
  req.body.password,(err,user)=>{
    if(err){
      res.statusCode=500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      if(req.body.firstname)
        user.firstname=req.body.firstname;
      if(req.body.lastname)
        user.lastname=req.body.lastname;
      user.save((err,user)=>{
        if(err){
          res.statusCode=500;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json({success:true, status: 'Registration succesfull!'});
        });
      });
    }
  });
  /*User.findOne({username:req.body.username})
  .then((user)=>{
    if(user!=null){
      var err=new Error('User '+req.body.username+' already exists!');
      err.status=403;
      next(err);
    }
    else{
      return User.create({
        username:req.body.username,
        password:req.body.password});
    }
  })
  .then((user)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json({status:'Registration succesfull!',user:user});    
  },
  (err)=>next(err))
  .catch((err)=>next(err));*/
});

router.post('/login',cors.corsWithOptions,passport.authenticate('local'),(req,res)=>{
  var token=authenticate.getToken({_id:req.user._id});
  res.statusCode=200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true,token: token, status: 'You are succesfullly logged in!' });
  /*if(!req.session.user){
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(":");
    var username = auth[0];
    var password = auth[1];
    User.findOne({username:username})
    .then((user)=>{
      if(user==null){
        var err = new Error('User '+user.username+' does not exists!');
        err.status = 403;
        return next(err);
      }
      else if(user.password!=password){
        var err = new Error('Enter correct password!');
        err.status = 403;
        return next(err);
      }
      else if (user.username == username && user.password == password) {
        req.session.user='authenticated';
        res.statusCode200;
        res.setHeader('Content-type','text/plain');
        res.end('You are authenticated1');
      }
      else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
    })
    .catch((err)=>next(err));    
  }
  else{
    res.statusCode200;
    res.setHeader('Content-type','text/plain');
    res.end('You are already authenticated1');
  }*/
});

router.get('/logout',cors.corsWithOptions,(req,res)=>{
  //console.log('iL');
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    //console.log('iL');
    var err=new Error('You are not logged in.');
    err.status=403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

module.exports = router;
