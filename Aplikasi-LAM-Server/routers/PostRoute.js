'use strict';

var Post = require('../models/post');
var logger = require('../configs/logger');

module.exports = function(socket) {

  console.log('socket connected');

  Post.find(function(err, posts) {
    socket.emit('post:init', posts);
  });

  socket.on('post:kirim', function(data) {
    logger.debug(data);
    socket.broadcast.emit('post:kirim', data);
    var post = new Post({
      email: data.email,
      nama: data.nama,
      isiPost: data.isiPost,
      tanggal: data.tanggal
    });

    post.save(function(err) {
      if (err) logger.error(err);
    });

  });

  //komentar

  socket.on('post:komentar', function(data) {
    logger.debug(data);
    socket.broadcast.emit('post:komentar', data);

    Post.findOne({
      _id: data.id
    }, function(err, post) {
      post.komentar.push({
        nama: data.nama,
        komentar: data.komentar
      });

      post.save();
    });

  });

  //like

  socket.on('post:like', function(data) {
    logger.debug(data);
    socket.broadcast.emit('post:like', data);

    Post.findOne({
      _id: data.id
    }, function(err, post) {
      post.like.push({
        nama: data.nama
      });

      post.save();
    });

  });

};
