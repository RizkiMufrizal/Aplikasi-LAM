'use strict';

angular.module('AplikasiLAM')
  .controller('LoginController', ['$scope', 'ipCookie', 'UserService', function($scope, ipCookie, UserService) {

    $scope.processLogin = function(l) {
      UserService.getNamaUser(l).success(function(data) {
        ipCookie('email', data.email);
        ipCookie('nama', data.nama);
        $scope.namaUser = data.nama;
      });
    };

    $scope.logOut = function() {
      ipCookie.remove('email');
    };

  }]);
