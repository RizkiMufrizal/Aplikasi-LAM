'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/user', function(req, res) {
  User.findOne({
    email: req.query.email
  }, function(err, user) {
    return res.json(user);
  });
});

module.exports = router;
