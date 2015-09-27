'use strict';

var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var User = require('../models/user');

router.get('/user', function(req, res) {
  User.findOne({
    email: req.query.email
  }, function(err, user) {
    return res.json(user);
  });
});

router.post('/register', function(req, res) {
  bcrypt.hash(req.body.password, 11, function(err, hash) {
    if (err) return res.send(err);

    var user = new User({
      email: req.body.email,
      nama: req.body.nama,
      password: hash
    });

    user.save(function(err) {
      if (err) return res.send(err);
      res.json({
        success: true
      });
    });
  });
});

router.post('/login', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    bcrypt.compare(password, user.password, function(err, res) {
      if (!res) return done(null, false);

      if (!user) {
        return res.json({
          success: false
        });
      }

      res.json({
        success: true
      });
    });
  });
});

module.exports = router;
