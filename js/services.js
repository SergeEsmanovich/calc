'use strict';

/* Services */

var calcServices = angular.module('calcServices', ['ngResource']);
  calcServices.factory("XLSXReaderService", ['$q', '$rootScope',
        function($q, $rootScope) {
            var service = function(data) {
                angular.extend(this, data);
            };
 
            service.readFile = function(file, showPreview) {
                var deferred = $q.defer();
 
                XLSXReader(file, showPreview, function(data){
                    $rootScope.$apply(function() {
                        deferred.resolve(data);
                    });
                });
 
                return deferred.promise;
            };
 
            return service;
        }
    ]);
