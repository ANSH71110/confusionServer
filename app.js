var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var FileStore=require('session-file-store')(session);
var passport=require('passport');
var authenticate=require('./authenticate');
var config=require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter=require('./routes/uploadRouter');
var favouriteRouter=require('./routes/favouriteRouter');

const mongoose=require('mongoose');

const Dishes=require('./models/dishes');
const Promotions=require('./models/promotions');
const Leaders=require('./models/leaders');
const Favorite=require('./models/favourite');
const { Session } = require('express-session');
const { hostname } = require('os');

const url=config.mongoUrl;
//const url='mongodb://localhost:27017/conFusion';
const connect=mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected correctly to the server');
},(err)=>{console.log(err);
});

var app = express();
app.all('*',(req,res,next)=>{
  if(req.secure)
    return next();

  else{
    res.redirect(307,'https://'+hostname+':'+app.get('secPort')+req.url);
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));//string is the secret key and cookie will be signed with it
/*app.use(session({
  name:'session-id',
  secret:'12345-67890-09876-54321',
  saveUninitialized:false,
  resave:false,
  store:new FileStore
}));*/

app.use(passport.initialize());
//app.use(passport.session());

//only the 2 routes are accessible without authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);

/*function auth(req,res,next){
  //console.log(req.session);
  console.log(req.user);
  //if(!req.signedCookies.user){
  //if(!req.session.user){
  if(!req.user){
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      //console.log('iauthh');
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    //console.log('oauthh');
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(":");
    var username = auth[0];
    var password = auth[1];

    if (username == 'admin' && password == 'password') {
      //console.log('auth');
      //res.cookie('user','admin',{signed:true})
      req.session.user='admin';
      next();
    }
    else {
      //console.log('nauth');
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  }
  else{
    next();
    //if(req.signedCookies.user=='admin'){
    if(req.session.user=='authenticated'){
      next();
    }
    else{
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
  }
  
}
app.use(auth);
*/
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favourites',favouriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
