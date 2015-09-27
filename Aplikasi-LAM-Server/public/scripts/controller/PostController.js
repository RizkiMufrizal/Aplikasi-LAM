'use strict';

angular.module('AplikasiLAM')
  .controller('PostController', ['$scope', 'Socket', 'ipCookie', 'PostService', function($scope, Socket, ipCookie, PostService) {

    $scope.dataPost = [];
    $scope.dataTimeLine = [];
    $scope.dataPostKirim = {};
    $scope.inputDataPost = {};
    $scope.glued = true;

    function initPost() {
      PostService.getPosts().success(function(data) {
        $scope.dataPost = data;
      })
    }

    initPost();

    $scope.kirimAspirasi = function(isiPost) {
      $scope.dataPostKirim.nama = ipCookie('nama');
      $scope.dataPostKirim.email = ipCookie('email');
      $scope.dataPostKirim.isiPost = isiPost;
      $scope.dataPostKirim.tanggal = new Date();

      $scope.dataPost.unshift({
        nama: $scope.dataPostKirim.nama,
        email: $scope.dataPostKirim.email,
        isiPost: $scope.dataPostKirim.isiPost,
        tanggal: $scope.dataPostKirim.tanggal
      });

      Socket.emit('post:kirim', $scope.dataPostKirim);
      $scope.inputDataPost.isiPost = '';
    };

    Socket.on('post:kirim', function(data) {
      $scope.dataPost.unshift({
        nama: data.nama,
        email: data.email,
        isiPost: data.isiPost,
        tanggal: data.isiPost
      });

      $scope.dataTimeLine.unshift({
        nama: data.nama,
        isiPost: data.isiPost
      });

      $scope.$apply();
    });

    //komentar

    $scope.inputKomentar = {};

    $scope.kirimKomentar = function(inputKomentar, id) {
      $scope.dataKomentar = {};
      $scope.dataKomentar.komentar = inputKomentar.komentar;
      $scope.dataKomentar.id = id;
      $scope.dataKomentar.nama = ipCookie('nama');

      for (var i in $scope.dataPost) {
        if ($scope.dataPost[i]._id === id) {

          if ($scope.dataPost[i].komentar === undefined) {
            $scope.dataPost[i].komentar = [];
          }

          $scope.dataPost[i].komentar.unshift({
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

          if ($scope.dataPost[i].komentar === undefined) {
            $scope.dataPost[i].komentar = [];
          }

          $scope.dataPost[i].komentar.unshift({
            nama: data.nama,
            komentar: data.komentar
          });
          $scope.dataTimeLine.unshift({
            namaKomentator: data.nama,
            komentar: true,
            nama: $scope.dataPost[i].nama
          });
        }
      }

      $scope.$apply();

    });

    $scope.munculKomentar = function(id) {
      $scope.dataId = id;
    };

    //like

    $scope.kirimLike = function(id) {
      $scope.dataLike = {};
      $scope.dataLike.id = id;
      $scope.dataLike.nama = ipCookie('nama');

      for (var i in $scope.dataPost) {
        if ($scope.dataPost[i]._id === id) {

          if ($scope.dataPost[i].like === undefined) {
            $scope.dataPost[i].like = [];
          }

          $scope.dataPost[i].like.unshift({
            nama: ipCookie('nama')
          });
        }
      }

      Socket.emit('post:like', $scope.dataLike);
    };

    Socket.on('post:like', function(data) {
      for (var i in $scope.dataPost) {
        if ($scope.dataPost[i]._id === data.id) {

          if ($scope.dataPost[i].like === undefined) {
            $scope.dataPost[i].like = [];
          }

          $scope.dataPost[i].like.unshift({
            nama: data.nama
          });
          $scope.dataTimeLine.unshift({
            namaLike: data.nama,
            like: true,
            nama: $scope.dataPost[i].nama
          });
        }
      }

      $scope.$apply();

    });


  }]);
