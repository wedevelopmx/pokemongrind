angular.module('app')
	.directive('dashboardmap', function() {
		return {
			restrict: 'AE',
			templateUrl: 'angular/templates/directives/dashboard-map.html',
			replace: true,
			transclude: true,
			scope: {
				selecting: '=',
				markers: '=',
				marker: '='
			},
			controller: ['$scope', '$http', 'MapService', function($scope, $http, MapService) {
				$scope.projection = 'EPSG:4326';

				//Default Position
				$scope.center = {
            lat: $scope.marker == undefined ? $scope.marker.lat : 19.4326,
          	lon: $scope.marker == undefined ? $scope.marker.lon : -99.1332,
            zoom: 5,
						centerUrlHash: true
        };

				$scope.style = {
						image: {
								icon: {
										anchor: [0.5, 1],
										anchorXUnits: 'fraction',
										anchorYUnits: 'fraction',
										opacity: 0.90,
										src: 'assets/images/unova_gym.png'
								}
						}
				};

				$scope.label = {
            message: '<img src="assets/images/logo.png" />',
            show: false,
            showOnMouseOver: true
        };

        $scope.defaults = {
            events: {
                map: [ 'singleclick', 'pointermove' ]
            }
        };

				//Initializing style
				$scope.marker.style = $scope.style;

				$scope.$watch('markers', function(newVal, oldVal) {
					angular.forEach($scope.markers, function(value, key) {
						value.style = $scope.style;
						value.label = $scope.label;
					});
				});


				$scope.$on('openlayers.map.singleclick', function(event, data) {
					if($scope.selecting) {
						$scope.$apply(function() {
							var location = MapService.sanitizeLocation(data, $scope.projection);
							$scope.marker.lat = location.lat;
							$scope.marker.lon = location.lon;
							$scope.marker.projection = location.projection;
						});
					}
        });

				$scope.$on('centerUrlHash', function(event, centerHash) {
						 //console.log(centerHash);
				 });


				 //Search functionality
				$scope.$watch('search', function(newVal, oldVal) {
					if(newVal === undefined || newVal.length < 5)
						return;
					var url = 'http://nominatim.openstreetmap.org/search/' + newVal + '?format=json&addressdetails=1&limit=10';
					$http.get(url).success(function(data){
						$scope.result = [];
						for(i in data) {
							$scope.result.push(data[i]);
						}
					});
				});

				$scope.searchResultSelected = function(item) {
					$scope.center.lat = $scope.marker.lat = parseFloat(item.lat);
						$scope.center.lon = $scope.marker.lon = parseFloat(item.lon);
						$scope.center.zoom = 13;
						$scope.location = item;
						$scope.result = [];
				};

			}],
			link: function(scope, elem, attrs) {
				angular.forEach(scope.markers, function(marker, key) {
					console.log(key);
					marker.style = {
							image: {
									icon: {
											anchor: [0.5, 1],
											anchorXUnits: 'fraction',
											anchorYUnits: 'fraction',
											opacity: 0.90,
											src: 'assets/images/logo.png'
									}
							}
					};
				});
			}
		};
	});
