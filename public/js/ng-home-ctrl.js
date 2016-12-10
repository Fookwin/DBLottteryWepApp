angular.module('ng-release-management-app').controller('ng-home-ctrl', function ($scope, $timeout, $http, session) {
    $scope.session = session.data;
});