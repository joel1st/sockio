"use strict";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compress = require('compression');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//require routes
var routes = require('./routes/index');
var createRoom = require('./routes/createRoom');

//require sockets
var regularPage = require('./sockets/regularPage');
var overview = require('./sockets/overview');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var sessionMiddleware = session({
    secret: process.env.SECRET || 'secret ',
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 3 * 1 * 24 * 60 * 60 // = 3 months
    }),
    resave: true,
    saveUninitialized: true
});
app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', routes);
app.use('/createRoom', createRoom);

//socket namespacing
var recentThreads = [];
//http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x/25618636#25618636
io.use(function(socket, next){
    sessionMiddleware(socket.request, socket.request.res, next);
});
regularPage(io, recentThreads);
overview(io, recentThreads)


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
        message: err.message,
        error: {}
    });
});


module.exports = {
    app: app,
    http: http
};
