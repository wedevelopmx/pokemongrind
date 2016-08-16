angular.module('app')
	.factory('GymService', ['$resource', function($resource) {
	        var Gym = $resource('gym/:gymId/:action', {gymId: '@id'}, {
						query: { method: 'GET',  isArray:true },
						get: { method: 'GET', isArray: false},
						update: { method: 'PUT'},
						delete: { method: 'DELETE', isArray: true },
						top: {
							method: 'GET',
							params: {
								action: 'top',
								gymId: '@id'
							},
							isArray: true
						},
						join: {
							method: 'POST',
							params: {
                action:'join',
                gymId: '@id'
            	}
						},
						leave: {
							method: 'POST',
							params: {
								action: 'leave',
								gymId: '@id'
							}
						}
					});

	        return Gym;
	    }]);
