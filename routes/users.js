var express = require('express');
const mongoose=require('mongoose');
const { route } = require('.');
var router = express.Router();
const User=require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next)=>{
  User.findOne({username:req.body.username})
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
  .catch((err)=>next(err));
});

router.post('/login',(req,res,next)=>{
  if(!req.session.user){
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
  }
});

router.get('/logout',(req,res)=>{
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

module.exports = router;
