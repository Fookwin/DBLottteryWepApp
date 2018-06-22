var app = angular.module('ng-dashboard-app', ['ngRoute']);
app.run(function () {
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', { redirectTo: '/home' })
        .when('/home', { templateUrl: '/templates/dashboard/home-view.html' })
        .otherwise({ redirectTo: '/' });
}]);

