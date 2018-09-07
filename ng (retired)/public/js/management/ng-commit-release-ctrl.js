angular.module('ng-release-management-app').controller('ng-commit-release-ctrl', 
    function ($scope, $http, $location, util, session) {       

    // data for root scope
    $scope.commitPackage = session.data.commitPackage;

    session.data.selectedNavIndex = 1;

    if (!$scope.commitPackage)
    {
        // get the pending action from pending container
        $http.get('/action/pending').success(function (res) {
            $scope.commitPackage = {
                container: res.data.Container,
                actions: []
            };

            res.data.Files.forEach(function(fileName) {
                $scope.commitPackage.actions.push({
                    file: fileName,
                    content: undefined,
                    state: 'pending'     
                }); 
            });

        }).error(function(err) {
            alert("Failed : " + err);
        });
    }

    $scope.showFileContent = function (action, show) {
        
        if (show) {
            $http.get('/blob/?container=' + $scope.commitPackage.container + '&blob=' + action.file).success(function (res) {
                action.showContent = true;
                action.content = res.content;
            }).error(function(err) {
                alert("Failed : " + err);
            });
        } else {
            action.showContent = false;
        }        
    }

    $scope.removeAction = function (action) {
        $http.delete('/action/remove/?container=' + $scope.commitPackage.container + '&blob=' + action.file).success(function (res) {
            var index = $scope.commitPackage.actions.indexOf(action);
            if (index > -1) {
                $scope.commitPackage.actions.splice(index, 1);
            }
        }).error(function(err) {
            alert("Failed : " + err);
        });
    }

    $scope.commit = function () {
        $scope.commitStatus = "pushing ...";
        $http.post('/commit', session.data.releaseContent).success(function (res) {

            if (res.data.Files){
                $scope.commitPackage.actions.forEach(function (action) {
                    if (res.data.Files.find(function (name) { return name === action.file})) {
                        action.state = "error";
                    } else {
                        action.state = "success";
                    }
                });
            }

            $scope.commitStatus = undefined;
            
        }).error(function(err) {
            alert("Failed : " + err);

            $scope.commitStatus = undefined;
        });
    }
});