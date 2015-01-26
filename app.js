//modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').load();

//route files
var routes = require('./routes/index');
var flights = require('./routes/flights');
var airports = require('./routes/airlines');
var reuinion = require('./routes/reunion');

//app
var app = express();

//set environment
app.set('env',process.env.APP_ENV);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//pass env variables to router
app.use(function(req,res,next){
    req.ENVIRONMENT = {
        fxml_url   : 'http://flightxml.flightaware.com/json/FlightXML2/',
        username   : process.env.FLIGHT_AWARE_USERNAME,
        apiKey     : process.env.FLIGHT_AWARE_APIKEY,
        mongo_host : process.env.MONGO_HOST,
        env        : app.get('env')
    };
    next();
});
// routes
app.use('/', routes);
app.use('/flights',flights);
app.use('/airlines',airports);
app.use('/reunion',reuinion);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: '',
        error: {}
    });
});


module.exports = app;
