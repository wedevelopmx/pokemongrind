angular.module('app')
  .controller('DashboardController', ['$scope', 'Auth', 'UserService', 'TeamService', function($scope, Auth, UserService, TeamService) {
    $scope.gyms = [];

    TeamService.query(function(teams) {
      $scope.teams = teams;
    });

    $scope.joinTeam = function() {
      console.log($scope.team);
      TeamService.join({ id: $scope.team.id, level: $scope.userLevel }, function(user) {
        Auth.refreshUser();
        //Reload teams
        TeamService.query(function(teams) {
          $scope.teams = teams;
        });
      });
    };

    Auth.onLogin()
      .then(function(user) {
        UserService.gyms(user, function(gyms) {
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
        if(gym.teams[team].id == $scope.user.Team.id) {
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
