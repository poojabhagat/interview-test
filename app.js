var express = require('express');

var path = require('path');
var port = process.env.PORT || 2021;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var http = require('http');
var session = require('express-session');
var fs  = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');

var config = require('./config/config');//db connection
var db;

//connect database
MongoClient.connect(config.mongoDatabase,{useUnifiedTopology:true}, function (err, coll) {
  if (err) {
      res.status(500).send("No Internet Connection");
      console.log(err);
  }
  else {
      //db = coll;
      db = coll.db('arkenea_db');
      console.log("mongodb database connected");
  }
});


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db;
  next();
});


app.get('/', routes.index);
app.get('/tpl/:name',routes.tpl)
app.use('/users', users);



// start server
var server = app.listen(2022, function () {
  console.log('Starting at ' + (new Date()).toString());
  console.log('Server listening on port ' + server.address().port);
});

module.exports = app;
