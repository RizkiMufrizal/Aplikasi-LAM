'use strict';

angular
  .module('AplikasiLAM', [
    'ngRoute',
    'btford.socket-io',
    'ipCookie'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../templates/beranda.html'
      });
  }]);
