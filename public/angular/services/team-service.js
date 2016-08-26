angular.module('app')
	.factory('TeamService', ['$resource', function($resource) {
	        var Team = $resource('team/:teamId/:action', {teamId: '@id', level: '@level'}, {
						query: { method: 'GET',  isArray:true },
						update: { method: 'PUT'},
						delete: { method: 'DELETE', isArray: true },
						join: {
							method: 'POST',
							params: {
                action:'join',
                teamId: '@id'
            	}
						}
					});

	        return Team;
	    }]);
