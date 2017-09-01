var express = require('express'); 
var path = require('path');
var bodyParser = require('body-parser'); 
var routes = require('./controllers/index');
var users = require('./controllers/users');
var mysql = require('mysql');
var connection = require("express-myconnection");
var app =express();
var multipart = require('connect-multiparty');


//Create Sql Connection

var connection  = connection(mysql, {
host: "107.21.183.146",
user: "tcst",
password: "tabcaps",
database: "react_poc"
},'request');
app.use(connection);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true })); // to support encoded bodies
app.use(multipart());
app.use(require('./controllers'));
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen('3000', function(){
	console.log('server is running..');
	
});

module.exports = app;