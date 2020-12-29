var createError = require('http-errors');
var express = require('express');
const cloudinary = require('cloudinary').v2
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();
//const { MongoClient } = require("mongodb");


require('dotenv').config();

const validator = require('express-validator');
const session = require('express-session');
//const passport = require('./passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

cloudinary.config({
  cloud_name: 'yenngan',
  api_key: '884464388927933',
  api_secret: 'HBBYilY1aiSYle19tC6dFJH57qI'
})



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/home');
const listpostRouter = require('./routes/listpost');
const cartRouter = require('./routes/cart');

const app = express();
app.use(bodyParser.urlencoded({'extended':false}));
app.use(validator());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
require('hbs').registerPartials(__dirname + '/views/partials');
app.engine('hbs', hbs({ 
  extname:'hbs', 
  helpers: helpers,
  defaultView: 'default',
  layoutsDir: __dirname + '/views',
  //partialsDir : __dirname +'/views/partials',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
 }));
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
try {
      mongoose.connect( process.env.URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true});

  console.log("DB is connected");    
  }
catch (error) 
  { 
      console.error("Can't connect to DB");    
  }

// passport middlewares 
app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180 * 60 * 1000}
}));
// app.use(passport.initialize());
// app.use(passport.session({secret: process.env.SESSION_SECRET}));
app.use(flash());

//pass req.user to res.local
app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.session = req.session;
  next()
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', indexRouter);
app.use('/listpost',listpostRouter);
app.use('/carts', cartRouter);

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
