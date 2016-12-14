/* All angular application controllers */
var seagullControllers = angular.module('seagullControllers', []);

/* Images controller requests beego API server to get/delete images */
seagullControllers.controller('ImagesController', ['$scope', '$rootScope', '$routeParams', '$http',
  function($scope, $rootScope, $routeParams, $http) {
      // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
      $scope.predicate = '';
      $scope.reverse = false;

      /* Request beego API server to get images */
      $http.get('http://dev.imaicloud.com/dc/api/images').success(function(data) {
        $scope.images = data;
      });
}]);
