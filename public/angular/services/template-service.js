angular.module('app')
	.service('TemplateService', ['$http', '$q', function($http, $q) {
		var _self = this;

		_self.templates = {
			'project-popup': null,
			'state-popup': null
		};

		this.compileTemplate = function(templateName, data) {
			var deferred = $q.defer();

			if(_self.templates[templateName] == null) {
				console.log('loading template');
				$http({
				  method: 'GET',
				  url: '/angular/templates/partials/' + templateName + '.html'
				}).then(function successCallback(response) {
				    _self.templates[templateName] = response.data;
				    var template = _.template(_self.templates[templateName]);
					deferred.resolve(template(data));
				  }, function errorCallback(response) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				    deferred.reject('<span>Error</span>');
				  });
			} else {
				var template = _.template(_self.templates[templateName]);
				deferred.resolve(template(data));
			}

			return deferred.promise;
		};
	}]);
