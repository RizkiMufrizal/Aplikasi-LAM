'use strict';

angular.module('AplikasiLAM')
  .factory('PostService', ['$http', function($http) {
    return {
      getPosts: function() {
        return $http.get('/api/post');
      }
    };
  }]);
