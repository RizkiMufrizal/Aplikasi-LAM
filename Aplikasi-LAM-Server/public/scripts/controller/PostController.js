'use strict';

angular.module('AplikasiLAM')
  .controller('PostController', ['$scope', 'Socket', 'ipCookie', function($scope, Socket, ipCookie) {

    $scope.dataPost = [];
    $scope.dataPostKirim = {};

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
      console.log($scope.dataPostKirim);

      Socket.emit('post:kirim', $scope.dataPostKirim);
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

  }]);
