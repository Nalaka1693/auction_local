var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var Promise = require('es6-promise').Promise;
var session = require("client-sessions");

var bids = require('./routes/bids');
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var items = require('./routes/items');
var auctions = require('./routes/auctions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(session({
    cookieName: 'session',
    secret: 'qwertyui12345678',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));
app.use(cors());
app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    res.header("Access-Control-Allow-Headers",'ContentType');
    next();
}) ;



app.use('/', login);
app.use('/bids', bids);
app.use('/index', index);
app.use('/users', users);
app.use('/items', items);
app.use('/auctions', auctions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
