angular.module('app')
	.factory('TeamService', ['$resource', function($resource) {
	        var Team = $resource('team/:teamId/:action', {teamId: '@id'}, {
						query: { method: 'GET',  isArray:true },
						update: { method: 'PUT'},
						delete: { method: 'DELETE', isArray: true }
					});

	        return Team;
	    }]);
