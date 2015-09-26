'use strict';

angular.module('AplikasiLAM')
  .controller('LoginController', ['$scope', 'ipCookie', function($scope, ipCookie) {

    $scope.processLogin = function(l) {
      ipCookie('email', l);
    };

    $scope.logOut = function() {
      ipCookie.remove('email');
    };

  }]);
