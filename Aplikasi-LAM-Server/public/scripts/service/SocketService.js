'use strict';

angular.module('AplikasiLAM')
  .service('Socket', function(socketFactory) {
    return socketFactory({
      ioSocket: io.connect()
    });
  });
