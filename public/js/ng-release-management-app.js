var app = angular.module('ng-release-management-app', ['ngRoute']);
app.run(function () {
    //window.onload = function () {
    WebPullToRefresh.init({
        loadingFunction: function () {
            return new Promise(function (resolve, reject) {
                // Run some async loading code here
                if (true /* if the loading worked */) {
                    resolve();
                } else {
                    //reject();
                }
            });
        }
    });
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', { redirectTo: '/publish/release' })
        .when('/users', { templateUrl: '/templates/user-picker-view.html' })
        .when('/publish', { redirectTo: '/publish/release' })
        .when('/publish/release', { templateUrl: '/templates/publish-release-data-view.html' })
        .when('/publish/commit', { templateUrl: '/templates/publish-commit-release-view.html' })
        .when('/notification', { templateUrl: '/templates/notification-view.html' })
        .otherwise({ redirectTo: '/' });
}]);

app.directive("ngGeneralHeaderDirective", function () {
    return {
        restrict: 'EAC',
        controller: 'ng-index-header-ctrl',
        templateUrl: '/templates/header.html'
    };
});

app.controller('ng-index-header-ctrl', function ($scope, $interval, session) {
    $scope.session = session.data;

    $scope.navButtons = [
        { title: 'PUBLISH', href: '#/publish' },
        { title: 'COMMIT', href: '#/publish/commit' },
        { title: 'NOTIFICATION', href: '#/notification' },
        { title: 'USERS', href: '#/users' },
    ];

    $scope.navigateTo = function (index) {
        session.data.selectedNavIndex = index;
    };
});

app.controller('ng-index-footer-ctrl', function ($scope, $http) {
    $http.get('/templates/footer.html').then(function (res) {
        $scope.footer = res.data;
    });
});

app.directive("ngUserPickerView", function () {
    return {
        restrict: 'EAC',
        controller: 'ng-user-picker-ctrl',
        templateUrl: '/templates/user-picker-view.html'
    };
});

