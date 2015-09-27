'use strict';

var user;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

user = new Schema({
  email: {
    type: 'String',
    required: true
  },
  nama: {
    type: 'String',
    required: true
  },
  password: {
    type: 'String',
    required: true
  },
  enable: {
    type: 'boolean',
    require: true,
    default: false
  }
}, {
  collection: 'tb_user'
});

module.exports = mongoose.model('User', user);
