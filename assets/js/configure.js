var main = angular.module('main', ['ngRoute']);

main.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'assets/pages/main.html',
      controller : 'mainController'
    })
    .when('/start', {
      templateUrl: 'assets/pages/start.html',
      controller : 'startController'
    })
    .when('/list', {
      templateUrl: 'assets/pages/list.html',
      controller : 'listController'
    })
    .when('/catalogue/:trail', {
      templateUrl: 'assets/pages/trails.html',
      controller : 'trailController'
    })
    .when('/location/:step', {
      templateUrl: 'assets/pages/location.html',
      controller : 'locationController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
