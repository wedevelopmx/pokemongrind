angular.module('app')
	.constant('Settings', {
		markers: [],
		map: {
			center: {
				latitude: 22.13,
				longitude: -100.97
			},
			options: {
				panControl    : false,
				zoomControl   : true,
				scaleControl  : false,
				mapTypeControl: false
			},
			zoom: 15,
			events: {
			} // TO BE DEFINED LATER
		},
		gymMarkerStyle: {
			icon: 'assets/images/unova_gym.png',
			popupTemplateUrl: 'angular/templates/partials/gym.html'
		}
	})
	.directive('dashboardmap', function() {
		return {
			restrict: 'AE',
			templateUrl: 'angular/templates/directives/dashboard-map.html',
			replace: true,
			transclude: true,
			scope: { },
			controller: ['$scope', '$http', '$log', '$geolocation', 'uiGmapGoogleMapApi', 'GymService', 'Settings',
				function($scope, $http, $log, $geolocation, GoogleMapApi, GymService, Settings) {

				//Initializing the map & styles
				angular.extend($scope, Settings);

				GoogleMapApi.then(function(maps) {
					angular.extend($scope.map.options, {
						mapTypeId: maps.MapTypeId.ROADMAP,
						zoomControlOptions:  {
			          position: maps.ControlPosition.RIGHT_TOP,
			          style: 'LARGE'
			      }
					});
				});

				//Adding click event
				angular.extend($scope.map.events, {
					click: function (mapModel, eventName, originalEventArgs) {
						//If we are selecting a place in map
						if($scope.selecting) {
							var e = originalEventArgs[0];
							var lat = e.latLng.lat(),
									lon = e.latLng.lng();

							angular.extend($scope.gym, {
								fakeId: 0,
								options: $scope.gymMarkerStyle,
								latitude: lat,
								longitude: lon
							});
							//scope apply required because this event handler is outside of the angular domain
							$scope.$evalAsync();
						}
					}
				});

				//Get geo location
				$geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
						angular.extend($scope.map.center, {
						 latitude: position.coords.latitude,
						 longitude: position.coords.longitude
						});
						$scope.map.zoom = 15;
         });

				$scope.$watch('markers.length', function(newVal, oldVal) {
					angular.forEach($scope.markers, function(marker, key) {
						marker.show = false;
					});
				});

				GymService.query(function(gyms) {
					$scope.markers = gyms;
				});

				$scope.addGym = function() {
					$scope.selecting = !$scope.selecting;
				}

				$scope.cancel = function() {
					$scope.selecting = false;
				}

				$scope.submitGym = function() {
					console.log($scope.gym);
					GymService.save($scope.gym, function(gym) {
						$scope.markers.push(gym);
						$scope.resetGym();
						$scope.selecting = false;
					});
				}

				$scope.resetGym = function() {
					$scope.gym = {
							fakeId: 0,
							options: $scope.gymMarkerStyle,
							latitude: 19.4326,
							longitude: -99.1332
					};
				}

				$scope.$on('join', function(evt, gym) {
					angular.forEach($scope.markers, function(marker, key) {
						if(marker.id == gym.id) {
							marker.teams = gym.teams;
							marker.member = true;
							marker.show = true;
						}
					});
				});

				$scope.$on('leave', function(evt, gym) {
					angular.forEach($scope.markers, function(marker, key) {
						if(marker.id == gym.id) {
							marker.teams = gym.teams;
							marker.member = false;
							marker.show = true;
						}
					});
				});

				$scope.resetGym();
			}]
		};
	});
