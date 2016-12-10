angular.module('ng-release-management-app').controller('ng-notification-ctrl', 
function ($scope, $http, $location, util, session) {
    session.data.selectedNavIndex = 3;

    $http.get('/notifications').then(function SuccessCallback(res) {
        $scope.templateList = res.data.data;
        $scope.selectedTemplate = $scope.templateList[0];
        $scope.notification = $scope.selectedTemplate.Value;
    }, function errCallback(res) {
        alert(res.data.err);
    });

    $scope.notify = function () {
        $http.post('/notify', { platforms: [1, 2, 3], msg: $scope.notification }).then(function SuccessCallback(res) {
            alert(res.data.data);
        }, function errCallback(res) {
            alert(res.data.err);
        });
    }
});