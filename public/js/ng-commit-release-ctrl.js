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

    $scope.showFileContent = function (action, show) {
        
        if (show) {
            $http.get('/blob/?container=' + $rootScope.commitPackage.container + '&blob=' + action.file).success(function (res) {
                action.showContent = true;
                action.content = res.content;
            }).error(function(err) {
                alert("Failed : " + err);
            });
        } else {
            action.showContent = false;
        }        
    }
});