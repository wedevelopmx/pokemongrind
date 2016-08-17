angular.module('app')
  .controller('GymController', ['$scope', '$routeParams', 'GymService', function($scope, $routeParams, GymService) {
    
    GymService.get({ gymId: $routeParams.id }, function(gym) {
      $scope.gym = gym;
    });

    GymService.top({gymId: $routeParams.id}, function(topPlayers) {
      $scope.topPlayers = topPlayers;
    })

  }]);
