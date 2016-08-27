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
			zoom: 6,
			events: {
			} // TO BE DEFINED LATER
		},
		gymMarkerStyle: {
			'instinct': {
				icon: 'assets/images/instinct/unova_gym.png',
				scaledSize: { width: 36, height: 48 },
				popupTemplateUrl: 'angular/templates/partials/gym.html'
			},
			'mystic': {
				icon: 'assets/images/mystic/unova_gym.png',
				popupTemplateUrl: 'angular/templates/partials/gym.html'
			},
			'valor': {
				icon: 'assets/images/valor/unova_gym.png',
				popupTemplateUrl: 'angular/templates/partials/gym.html'
			},
			'default': {
				icon: 'assets/images/unova_gym.png',
				popupTemplateUrl: 'angular/templates/partials/gym.html'
			}
		}
	})
	.directive('dashboardmap', function() {
		return {
			restrict: 'AE',
			templateUrl: 'angular/templates/directives/dashboard-map.html',
			replace: true,
			transclude: true,
			controller: ['$scope', '$geolocation', 'uiGmapGoogleMapApi', 'GymService', 'Settings',
				function($scope, $geolocation, GoogleMapApi, GymService, Settings) {

				//Initializing the map & styles
				angular.extend($scope, Settings);

				//If User has not chose team, we define default theme on markers
				$scope.team = $scope.user ? ($scope.user.Team ? $scope.user.Team.avatar : 'default') : 'default';
				$scope.selectedMarkerStyle = $scope.gymMarkerStyle[$scope.team];
				$scope.$watch('user.Team', function(newVal, oldVal) {
					$scope.team = newVal ? newVal.avatar : 'default';
					$scope.selectedMarkerStyle = $scope.gymMarkerStyle[$scope.team];
				});

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
								options: $scope.selectedMarkerStyle,
								latitude: lat,
								longitude: lon
							});
							//Remove alert message
							$scope.locationError = false;
							//scope apply required because this event handler is outside of the angular domain
							$scope.$evalAsync();
						}
					}
				});

				$scope.findMe = function() {
				 //Get geo location
				 $geolocation.getCurrentPosition({
				     timeout: 60000,
					    maximumAge: 250,
					    enableHighAccuracy: true
				  }).then(function(position) {
							angular.extend($scope.map.center, {
							 latitude: position.coords.latitude,
							 longitude: position.coords.longitude
							});
							$scope.map.zoom = 15;
				  });
				}

				$scope.findMe();

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
					if($scope.gym.longitude == 0 || $scope.gym.latitude == 0) {
						$scope.locationError = true;
					} else {
						GymService.save($scope.gym, function(gym) {
							$scope.markers.push(gym);
							$scope.resetGym();
							$scope.selecting = false;
						});
					}
				}

				$scope.resetGym = function() {
					$scope.gym = {
							fakeId: 0,
							options: $scope.selectedMarkerStyle,
							latitude: 0,
							longitude: 0
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
