angular.module('ng-release-management-app').controller('ng-commit-release-ctrl', function ($scope, $rootScope, $http, $location, util) {       

    // data for root scope
    $rootScope.selectedNavIndex = 2;

    $scope.saveReleaseData = function () {
        $http.post('/submit', $rootScope.releaseContent).success(function (res) {
           $location.url('/notification');
        }).error(function(err) {
            alert("Failed : " + err);
        });
    };
});