angular.module('app')
  .controller('JoinGymController', ['$scope', 'GymService', function($scope, GymService) {
    $scope.join = function(gym) {
      GymService.join(gym, function(gym) {
        $scope.$emit('join', gym);
      });
    }

    $scope.leave = function(gym) {
      GymService.leave(gym, function(gym) {
        $scope.$emit('leave', gym);
      });
    }
  }]);
