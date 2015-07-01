'use strict';

/* App Module */

var calcApp = angular.module('calcApp', [
    'ngRoute',
    'calcControllers',
    'angular-inview',
    'ui.select',
    'ngSanitize',
    'ui.bootstrap',
    'ui.slider',
    'ngAnimate'
]);

calcApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/home', {
                    templateUrl: 'partials/home.html',
                    controller: 'HomeCtrl'
                }).
                otherwise({
                    redirectTo: '/home'
                });
    }]);
