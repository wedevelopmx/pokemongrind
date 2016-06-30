angular.module('app')
    .factory('Auth', function($resource, $rootScope, $sessionStorage, $q, $http, policies){

    /**
     *  User profile resource
     */
    var Profile = $resource('/auth/loggedin', {}, {
        login: {
            method: "GET",
            isArray : false
        }
    });

    var auth = {};

    /**
     *  Saves the current user in the root scope
     *  Call this in the app run() method
     */
    auth.init = function(){
        if (auth.isLoggedIn()){
            $rootScope.user = auth.currentUser();
        } else {
            // $http.get('/auth/loggedin').success(function(user){
            //     console.log('Init: /auth/loggedin: ' + (user ? user.displayname : 'uknown') );
            //     auth.loggedIn(user);
            // });
            auth.refreshUser();
        }
    };

    auth.refreshUser = function() {
      $http.get('/auth/loggedin').success(function(user){
          console.log('Init: /auth/loggedin: ' + (user ? user.displayName : 'uknown') );
          auth.loggedIn(user);
      });
    };

    auth.userIsLoggedIn = function() {
        var deferred = $q.defer();
        if(auth.isLoggedIn()) {
            deferred.resolve();
        } else {
            $http.get('/auth/loggedin')
                .success(function(user){
                    auth.loggedIn(user);
                    if(!auth.isLoggedIn())
                        deferred.reject();
                    deferred.resolve();
                });
        }

        return deferred.promise;
    };

    auth.userHasPermissionForView = function(view) {
        var deferred = $q.defer();

        var policy = policies[view];
        if(!policy.permissions || !policy.permissions.length){
            deferred.resolve({type: 'success', text: 'View is public.'});
        } else {
            auth.userIsLoggedIn()
                .then(function() {
                    if(auth.userHasPermission(policy.permissions))
                        deferred.resolve({type: 'success', text: 'User has permissions.'});
                    else
                        deferred.reject({type: 'danger', text: 'User has NOT permissions.'});
                }, function() {
                    deferred.reject({type: 'danger', text: 'View is private, please login.'});
                });
        }
        return deferred.promise;
    };

    auth.loggedIn = function(data) {
        $sessionStorage.user = data;
        $rootScope.user = $sessionStorage.user;
    };

    auth.login = function(username, password){
        return $q(function(resolve, reject){
            //Profile.login({username:username, password:password}).$promise
            Profile.login({username:username, password:password}).$promise
            .then(function(data) {
                $sessionStorage.user = data;
                $rootScope.user = $sessionStorage.user;
                resolve();
            }, function() {
                reject();
            });
        });
    };


    auth.logout = function() {
        $http.get('/auth/logout').success(function(){
            console.log('Bye: /auth/logout');
            delete $sessionStorage.user;
            delete $rootScope.user;
        });
    };

    auth.userHasPermission = function(permissions){
        if(!auth.isLoggedIn()){
            return false;
        }

        var found = false;
        if($sessionStorage.user.user_permissions && $sessionStorage.user.user_permissions.length){
            angular.forEach(permissions, function(permission, index){
                if ($sessionStorage.user.user_permissions.indexOf(permission) >= 0){
                    console.log('User with role: ' + permission);
                    found = true;
                    return found;
                }
            });
        }

        return found;
    };


    auth.currentUser = function(){
        return $sessionStorage.user;
    };


    auth.isLoggedIn = function(){
        return $sessionStorage.user != null;
    };

    auth.setPolicies = function(policies) {
        $sessionStorage.policies = policies;
    }

    return auth;
});
