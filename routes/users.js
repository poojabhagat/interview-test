var express = require('express');
var router = express.Router();
var objectId = require('mongodb').ObjectId;
var fs  = require('fs');

router.get('/getUsersList', function (req, res, next) {
  var db = req.db;
  var userObj = db.collection("Users");
  userObj.find({}).toArray(function (err, usrdata) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log(usrdata)
      res.status(200).send({ status: "success", usersList: usrdata });
    }
  })
});

router.get('/getUserInfo/:uid',function(req,res){
  var db = req.db;
  var userObj = db.collection("Users");
  userObj.find({_id:objectId(req.params.uid)}).toArray(function(err, uData){
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send({ status: "success", userData: uData });
    }
  })
});

router.post('/createUser', function (req, res) {
  console.log(req.body);
  var db = req.db;
  var userObj = db.collection("Users");
  userObj.findOne({ email: req.body.email }, function (err, data) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log(data)
      if (data == null || data.length == 0) {
        userObj.insertOne(req.body, function (err, result) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.status(200).send({ status: "added" });
          }
        });

      } else {
        res.status(200).send({ status: "exists" });
      }
    }
  });

});


router.put('/updateUser', function (req, res) {
  console.log(req.body);
  var db = req.db;
  var userObj = db.collection("Users");
  var updateObj = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    phone: req.body.phone
  };

  userObj.updateOne({ _id: objectId(req.body.id) }, { '$set': updateObj }, { upsert: false }, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send({ status: "updated" });
    }
  });
});

router.delete('/deleteUser/:id', function (req, res) {
  var db = req.db;
  var userObj = db.collection("Users");

  userObj.remove({ _id: objectId(req.params.id) }, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send({ status: "deleted" });
    }
  });
});


module.exports = router;
