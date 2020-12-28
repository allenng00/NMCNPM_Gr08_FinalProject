var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();
require('dotenv').config();

const { MongoClient } = require("mongodb");
const mongoose = require('./dal/db');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
mongoose.mongoose();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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

app.use('/', usersRouter);
// app.use('/home', indexRouter);


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