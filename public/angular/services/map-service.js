angular.module('app')
	.service('MapService', [function() {
		this.sanitizeLocation = function(data, projection) {
            if (projection === data.projection) {
                return {lat: data.coord[0], lon: data.coord[1]}; //data.coord;
            } else {
                var p = ol.proj.transform([ data.coord[0], data.coord[1] ], data.projection, projection);
                return {
                        lat: p[1],
                        lon: p[0],
                        projection: projection
                    };
            }
        }
	}]);
