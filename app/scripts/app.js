'use strict';

angular.module('hcDatavizApp', ['kendo.directives'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/steve', {
        templateUrl: 'views/steve.html',
        controller: 'SteveCtrl'
      })
      .when('/data', {
        templateUrl: 'views/data.html',
        controller: 'DataCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
