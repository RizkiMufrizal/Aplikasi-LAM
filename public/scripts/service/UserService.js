'use strict';

angular.module('AplikasiLAM')
  .factory('UserService', ['$http', function($http) {
    return {
      getNamaUser: function(email) {
        return $http.get('/api/user?email=' + email);
      }
    };
  }]);
