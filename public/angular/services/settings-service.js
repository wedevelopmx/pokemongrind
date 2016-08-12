angular.module('app')
  .factory('AccountService', ['$resource', function($resource) {
    var AccountService = $resource('account/:accountId', {accountId: '@id'}, {
      update: { method: 'PUT' },
      delete: { method: 'DELETE', isArray: true },
      remove: { method: 'DELETE' }
    });
    return AccountService;
  }])
  .factory('SettingService', ['$resource', function($resource) {
    var SettingService = $resource('setting/:settingId', {settingId: '@id'}, {
      update: { method: 'PUT' },
      delete: { method: 'DELETE', isArray: true }
    });
    return SettingService;
  }]);
