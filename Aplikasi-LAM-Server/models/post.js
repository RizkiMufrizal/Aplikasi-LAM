'use strict';

var post;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

post = new Schema({
  email: {
    type: 'String',
    required: true
  },
  nama: {
    type: 'String',
    required: true
  },
  isiPost: {
    type: 'String',
    required: true
  },
  tanggal: {
    type: 'Date',
    required: true
  },
  komentar: {
    type: 'array',
    required: false
  },
  like: {
    type: 'array',
    required: false
  }
}, {
  collection: 'tb_post'
});

module.exports = mongoose.model('Post', post);
