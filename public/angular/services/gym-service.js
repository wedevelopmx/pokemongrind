angular.module('app')
	.factory('GymService', ['$resource', function($resource) {
	        var Gym = $resource('gym/:gymId/:action', {gymId: '@id'}, {
						query: { method: 'GET',  isArray:true },
						update: { method: 'PUT'},
						delete: { method: 'DELETE', isArray: true },
						join: {
										method: 'POST',
										params: {
			                action:'join',
			                gymId: '@id'
			            	}
						},
						leave: {
										method: 'DELETE',
										params: {
											action: 'leave',
											gymId: '@id'
										}
						}
					});

	        return Gym;
	    }]);
