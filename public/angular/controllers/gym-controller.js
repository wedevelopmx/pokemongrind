angular.module('app')
  .controller('GymController', ['$scope', '$routeParams', 'GymService', function($scope, $routeParams, GymService) {
    console.log($routeParams.id);
    GymService.get({ gymId: $routeParams.id }, function(gym) {
      console.log(gym);
      $scope.gym = gym;
    });

    GymService.top({gymId: $routeParams.id}, function(topPlayers) {
      console.log(topPlayers);
      $scope.topPlayers = topPlayers;
    })

  }]);
