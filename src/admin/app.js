var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();
const validator = require('express-validator');
require('dotenv').config();
const passport = require('./passport');
const session = require("express-session");
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const { MongoClient } = require("mongodb");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');

console.log('RUNNING DB...');
try {
    mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    console.log("DB is connected");
} catch (error) {
    console.error(error);
}
var indexRouter = require('./routes/index');
var adminsRouter = require('./routes/admins');
var usersRouter = require('./routes/users');
// var productRouter = require('./routes/product');
// var orderRouter = require('./routes/order');

const app = express();
app.use(bodyParser.urlencoded({ 'extended': false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    helpers: helpers,
    defaultView: 'default',
    layoutsDir: __dirname + '/views',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session({
    secret: process.env.SESSION_SECRET
}));
app.use(flash());
app.use(validator());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next()
});

app.use('/', adminsRouter);
app.use('/logout', adminsRouter);
app.use('/profile', adminsRouter);
app.use('/changePassword', adminsRouter);
app.use('/home', indexRouter);
app.use('/home/users', usersRouter);
//app.use('/home/products', productRouter);
//app.use('/home/orders', orderRouter);
//app.use('/home/products/top10', productRouter);



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
    res.render('error', { title: 'Lỗi', fade: "fade" });
});

module.exports = app;