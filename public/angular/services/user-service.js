angular.module('app')
  .factory('UserService', ['$resource', function($resource) {
    var UserService = $resource('user/:userId/:action', {userId: '@id'}, {
      update: { method: 'PUT' },
      delete: { method: 'DELETE', isArray: true},
      gyms: {
        method: 'POST',
        params: {
          action: 'gyms',
          userId: '@id'
        },
        isArray: true
      }
    });
    return UserService;
  }]);
