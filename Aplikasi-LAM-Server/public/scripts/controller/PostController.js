'use strict';

angular.module('AplikasiLAM')
  .controller('PostController', ['$scope', 'Socket', 'ipCookie', function($scope, Socket, ipCookie) {

    $scope.dataPost = [];
    $scope.dataPostKirim = {};
    $scope.inputDataPost = {};

    Socket.on('post:init', function(data) {
      console.log(data);
      $scope.dataPost = data;
    });

    $scope.kirimAspirasi = function(isiPost) {
      $scope.dataPostKirim.nama = ipCookie('nama');
      $scope.dataPostKirim.email = ipCookie('email');
      $scope.dataPostKirim.isiPost = isiPost;
      $scope.dataPostKirim.tanggal = new Date();

      $scope.dataPost.push({
        nama: $scope.dataPostKirim.nama,
        email: $scope.dataPostKirim.email,
        isiPost: $scope.dataPostKirim.isiPost,
        tanggal: $scope.dataPostKirim.isiPost
      });

      Socket.emit('post:kirim', $scope.dataPostKirim);
      $scope.inputDataPost.isiPost = '';
    };

    Socket.on('post:kirim', function(data) {
      $scope.dataPost.push({
        nama: data.nama,
        email: data.email,
        isiPost: data.isiPost,
        tanggal: data.isiPost
      });
      $scope.$apply();
    });

    $scope.inputKomentar = {};

    $scope.kirimKomentar = function(inputKomentar, id) {
      $scope.dataKomentar = {};
      $scope.dataKomentar.komentar = inputKomentar.komentar;
      $scope.dataKomentar.id = id;
      $scope.dataKomentar.nama = ipCookie('nama');

      for (var i in $scope.dataPost) {
        if ($scope.dataPost[i]._id === id) {
          $scope.dataPost[i].komentar.push({
            nama: ipCookie('nama'),
            komentar: inputKomentar.komentar
          });
        }
      }

      Socket.emit('post:komentar', $scope.dataKomentar);
      $scope.inputKomentar.komentar = '';
    };

    Socket.on('post:komentar', function(data) {
      for (var i in $scope.dataPost) {
        if ($scope.dataPost[i]._id === data.id) {
          $scope.dataPost[i].komentar.push({
            nama: data.nama,
            komentar: data.komentar
          });
        }
      }
      $scope.$apply();

    });

    $scope.munculKomentar = function(id) {
      $scope.dataId = id;
    };

  }]);
