angular.module('app')
  .controller('DashboardController', ['$scope', 'Auth', 'UserService', function($scope, Auth, UserService) {
    $scope.gyms = [];

    Auth.onLogin()
      .then(function(user) {
        UserService.teams(user, function(gyms) {
          $scope.gyms = gyms;
        });
      });

    $scope.$on('logout', function() {
      $scope.gyms = [];
      console.log('logout');
    });

    $scope.$on('join', function(evt, gym) {
      for(team in gym.teams){
        //We just need our team information
        if(gym.teams[team].id == $scope.user.team.id) {
          $scope.gyms.push({
            id: gym.id,
            name: gym.name,
            members: gym.teams[team].members
          });
        }
      }

    });

    $scope.$on('leave', function(evt, gym) {
      $scope.gyms = $scope.gyms.filter(function(item) {
        return gym.id != item.id;
      });
    });

  }]);
