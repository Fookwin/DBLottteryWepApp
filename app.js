
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/static', express.static(path.join(__dirname, 'client/build/static')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// initialize the server
var apiServer = require('./server/server.js')(app);

// app.get('/', function (req, res) {
//     res.sendfile(path.join(__dirname, 'client/build', 'index.html'));
// });
app.get('*', function(req, res) {
    res.sendfile('index.html', {root: path.join(__dirname, 'client/build/')});
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
