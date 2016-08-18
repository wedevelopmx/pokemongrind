angular.module('app')
  .controller('GymController', ['$scope', '$routeParams', 'GymService', function($scope, $routeParams, GymService) {

    $scope.eventUrl = 'http://pokemongrind.com/#/gym/' + $routeParams.id;

    GymService.get({ gymId: $routeParams.id }, function(gym) {
      $scope.gym = gym;
    });

    GymService.top({gymId: $routeParams.id}, function(topPlayers) {
      $scope.topPlayers = topPlayers;
    })

  }]);
