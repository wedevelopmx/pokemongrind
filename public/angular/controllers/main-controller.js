angular.module('app')
  .controller('MainController', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
    $scope.app = {
      name: 'Hexagon',
      version: '1.0.0',
      // for chart colors
      color: {
        'primary':      '#0cc2aa',
        'accent':       '#a88add',
        'warn':         '#fcc100',
        'info':         '#6887ff',
        'success':      '#6cc788',
        'warning':      '#f77a99',
        'danger':       '#f44455',
        'white':        '#ffffff',
        'light':        '#f1f2f3',
        'dark':         '#2e3e4e',
        'black':        '#2a2b3c'
      },
      setting: {
        theme: {
          primary: 'primary',
          accent: 'accent',
          warn: 'warn'
        },
        folded: false,
        boxed: false,
        container: false,
        themeID: 1,
        bg: ''
      }
    };

    $scope.logout =function() {
			Auth.logout();
			$location.url('/');
		}
  }]);
