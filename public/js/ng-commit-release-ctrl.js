angular.module('ng-release-management-app').controller('ng-commit-release-ctrl', function ($scope, $rootScope, $http, $location, util) {       

    // data for root scope
    $rootScope.selectedNavIndex = 2;

    if (!$rootScope.commitPackage)
    {
        // get the pending action from pending container
        $http.get('/pending').success(function (res) {
            $rootScope.commitPackage = {
                container: res.data.Container,
                actions: []
            };

            res.data.Files.forEach(function(fileName) {
                $rootScope.commitPackage.actions.push({
                    file: fileName,
                    content: undefined,
                    state: 'pending'     
                }); 
            });

        }).error(function(err) {
            alert("Failed : " + err);
        });
    }

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

    $scope.commit = function () {
        $http.post('/commit', $rootScope.releaseContent).success(function (res) {
            if (res.data.Files){
                $rootScope.commitPackage.actions.forEach(function (action) {
                    if (res.data.Files.find(function (name) { return name === action.file})) {
                        action.state = "error";
                    } else {
                        action.state = "success";
                    }
                });
            }
            
        }).error(function(err) {
            alert("Failed : " + err);
        });
    }
});