angular.module('app')
  .factory('UserService', ['$resource', function($resource) {
    var UserService = $resource('user/:userId/:action', {userId: '@id'}, {
      update: { method: 'PUT' },
      delete: { method: 'DELETE', isArray: true},
      teams: {
        method: 'POST',
        params: {
          action: 'teams',
          userId: '@id'
        },
        isArray: true
      }
    });
    return UserService;
  }]);
