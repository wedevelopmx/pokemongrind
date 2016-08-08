angular.module('app')
  .controller('DashboardController', ['$scope', '$routeParams', 'GymService', function($scope, $routeParams, GymService) {

    $scope.addGym = function() {
      $scope.selectingGym = !$scope.selectingGym;
    }

    $scope.submitGym = function() {

      GymService.save($scope.gym, function(gym) {
				console.log(gym);
        $scope.gyms.push($scope.gym);
        $scope.resetGym();
        $scope.selectingGym = false;
			});
    }

    $scope.resetGym = function() {
      $scope.gym = {
          lat: 19.4326,
          lon: -99.1332,
          zoom: 5
      };
    }

    $scope.resetGym();
    $scope.gyms = [];
    $scope.teams = [];
    $scope.selectingGym = false;

    GymService.query(function(gyms) {
			$scope.gyms = gyms;
		});

    

  }]);
