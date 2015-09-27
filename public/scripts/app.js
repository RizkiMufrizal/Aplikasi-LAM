'use strict';

angular
  .module('AplikasiLAM', [
    'ngRoute',
    'btford.socket-io',
    'ipCookie',
    'luegg.directives'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../templates/beranda.html',
        controller: 'PostController'
      })
      .when('/about', {
        templateUrl: '../templates/about.html'
      });
  }]);
