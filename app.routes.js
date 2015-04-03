angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/', {
        templateUrl : 'user.html',
        controller  : 'userController'
    });

    $locationProvider.html5Mode(true);

});
