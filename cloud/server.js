var mongo = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID;
var db = mongo.db('localhost:27017/nfc?auto_reconnect');
var Data = db.collection('data');


var express = require('express');
var app = express.createServer();


app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/store/:id', function(req, res){
  Data.findOne({id: req.params.id}, function(err, doc){
    if(err || !doc) {
      res.send({error: 'nodata'});
      return;
    }
    res.send(doc);
  });
});

app.post('/store/:id', function(req, res){
  req.body.id = req.params.id;
  Data.update({id: req.params.id}, req.body, {upsert: true}, function(err){
    res.send('success');
  });
});

app.listen(80);

