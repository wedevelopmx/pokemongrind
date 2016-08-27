angular.module('app')
	.constant('Settings', {
		markers: [],
		map: {
			center: {
				latitude: 28.13,
				longitude: -110.97
			},
			control: {},
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
		//Google Geolocation API
		geolocationInvoked: false,
		APIcenter: {},
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
			controller: ['$scope', '$http', 'uiGmapGoogleMapApi', 'GymService', 'Settings', 'uiGmapIsReady',
				function($scope, $http, GoogleMapApi, GymService, Settings, uiGmapIsReady) {

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

				//Fixing angular-google-maps error - center not binded
				uiGmapIsReady.promise().then(function() {
					var map = $scope.map.control.getGMap();
					map.addListener('center_changed', function() {
							$scope.map.center.latitude = map.getCenter().lat();
							$scope.map.center.longitude = map.getCenter().lng();
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
					//We just invoke API once per display
					if(!$scope.geolocationInvoked) {
					 $http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDT1BiMuP2K1Z6l2ZTEwugOMlPAFX_aA_U', {})
						.then(function(response) {
							angular.extend($scope.APIcenter, {
								latitude: Math.round(response.data.location.lat * 1000) / 1000,
								longitude: Math.round(response.data.location.lng * 1000) / 1000
							});
							angular.extend($scope.map.center, $scope.APIcenter);
							$scope.map.zoom = 15;
							$scope.geolocationInvoked = true;
						}, function(response) {
							console.log('There has been an error on geolocation!');
						});
					} else {
						//Updating center based on saved values
						angular.extend($scope.map.center, $scope.APIcenter);
						$scope.map.zoom = 15;
					}
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
