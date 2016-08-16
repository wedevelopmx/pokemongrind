angular.module('app')
  .controller('SettingsController', ['$scope', 'UserService', 'AccountService', 'SettingService', 'Auth', 'TeamService',
    function($scope, UserService, AccountService, SettingService, Auth, TeamService) {
      // $scope.reset = function(user) {
      //     $scope.profile = {
      //       id: user.id,
      //       displayName: user.displayName,
      //       company: user.company,
      //       location: user.location,
      //       bio: user.bio,
      //       email: user.email,
      //       website: user.website,
      //       twitter: user.twitter,
      //       github: user.github,
      //       linkedin:user.linkedin,
      //       avatar: user.avatar
      //     };
      // };

      TeamService.query(function(teams) {
        $scope.teams = teams;
      });

      $scope.updateProfile = function(profile) {
        UserService.update(profile, function(profile) {
          Auth.refreshUser();
          console.log('Profile has been saved!');
        });
      };

      $scope.updateSettings = function(settings) {
        SettingService.update(settings, function(settings) {
          console.log('Settings have been saved!');
        });
      };

      $scope.sync = function(accountName) {

      };

      $scope.detach = function(account) {
        AccountService.remove({ accountId: account.id}, function(message) {
          console.log(message.txt);
          $scope.user.sync.github = undefined;
        })
      };

      //Initial Load
      UserService.get({ userId: $scope.user.id }, function(user) {
        console.log(user);
        $scope.settingsUser = user;
      });
    }]);
