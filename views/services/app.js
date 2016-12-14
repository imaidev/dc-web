/* The seagull angular application */
var dcweb = angular.module('dcweb', [
  'ngRoute',
  'seagullControllers',
  'ngCookies', // To save perference of i18n language
  'pascalprecht.translate'
]);
dcweb.config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/dc-web/views/services/images', {
        templateUrl: '/dc-web/views/services/images.html',
        controller: 'ImagesController'
      });
  }]
);
