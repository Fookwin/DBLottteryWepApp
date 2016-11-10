angular.module('ng-release-management-app').controller('ng-publish-release-data-ctrl', function ($scope, $rootScope, $http, $location, util) {       

    // data for root scope
    $rootScope.selectedNavIndex = 2;

    $scope.syncToCloud = function() {
        if ($scope.isSyncingToCloud)
            return;
            
        $scope.isSyncingToCloud = true;

        util.syncReleaseDateToCloud(function () {
            $scope.isSyncingToCloud = false;
        });
    }

    if (!$rootScope.originalReleaseContent) {
        // initialize the original data from cloud.
        $scope.syncToCloud();
    }
    
    $scope.onLotteryDataChanged = function () {
        $scope.isReleaseDataChanged = true;

        // increase the lottery version accordingly
        if ($rootScope.originalReleaseContent.dataVersion.latestLotteryVersion === $rootScope.releaseContent.dataVersion.latestLotteryVersion) {
                $rootScope.releaseContent.dataVersion.latestLotteryVersion ++;
        }
    }

    $scope.onReleaseDataChanged = function () {
        $scope.isReleaseDataChanged = true;

        // increase the lottery version accordingly
        if ($rootScope.originalReleaseContent.dataVersion.releaseDataVersion === $rootScope.releaseContent.dataVersion.releaseDataVersion) {
                $rootScope.releaseContent.dataVersion.releaseDataVersion ++;
        }
    }

    $scope.onDataVersionChanged = function () {
        $scope.isReleaseDataChanged = true;
    }

    $scope.syncToOffical = function() {
        if ($scope.isSyncingToOffical)
            return;

        $scope.isSyncingToOffical = true;

        $http.get('/offical/?issue=' + $rootScope.originalReleaseContent.lottery.issue).success(function (res) {
            
            if (res.data) {
                $rootScope.releaseContent.lottery = res.data;

                $rootScope.releaseContent.lottery.date = new Date($rootScope.releaseContent.lottery.date);

                $scope.onLotteryDataChanged(); // should only be detail changed.
            }

            $scope.isSyncingToOffical = false;
        }).error(function(err) {
            $scope.isSyncingToOffical = false;
        });
    }

    $scope.addNewRelease = function () {
        if ($scope.isAddingNew)
            return;

        $scope.isAddingNew = true;

        $http.post('/new', {
            issue: $rootScope.originalReleaseContent.next.issue, 
            date: $rootScope.originalReleaseContent.next.date
        }).success(function (res) {
            
            if (res.data) {
                $rootScope.releaseContent = res.data;

                // convert string to date
                $rootScope.releaseContent.next.date = new Date($rootScope.releaseContent.next.date);
                $rootScope.releaseContent.next.cutOffTime = new Date($rootScope.releaseContent.next.cutOffTime);
                $rootScope.releaseContent.lottery.date = new Date($rootScope.releaseContent.lottery.date);

                // copy the current version, but change the latest issue and lottery version
                $rootScope.releaseContent.dataVersion = angular.copy($rootScope.originalReleaseContent.dataVersion);
                $rootScope.releaseContent.dataVersion.latestIssue = $rootScope.originalReleaseContent.next.issue;
                $rootScope.releaseContent.dataVersion.latestLotteryVersion = 1; // set 1 as the init version.
                $rootScope.releaseContent.dataVersion.attributeDataVersion = 1; // set 1 as the init version.
                $rootScope.releaseContent.dataVersion.releaseDataVersion = 1; // set 1 as the init version.
            }

            $scope.isAddingNew = false;
        }).error(function(err) {
            $scope.isAddingNew = false;
        });

        $scope.isReleaseDataChanged = true;
    }

    $scope.resetReleaseData = function () {
        $rootScope.releaseContent = angular.copy($rootScope.originalReleaseContent);
        $scope.isReleaseDataChanged = false;
    };

    $scope.RandomReds = function() {
        
        var nums = util.getRandomNumbers(8, 33);
        $rootScope.releaseContent.recommendation.redIncludes = nums.slice(0, 2).sort(function (a, b) { return a > b; });
        $rootScope.releaseContent.recommendation.redExcludes = nums.slice(2).sort(function (a, b) { return a > b; });
        $scope.onReleaseDataChanged();
    }

    $scope.RandomBlues = function() {
        
        var nums = util.getRandomNumbers(4, 16);
        $rootScope.releaseContent.recommendation.blueIncludes = nums.slice(0, 1).sort(function (a, b) { return a > b; });
        $rootScope.releaseContent.recommendation.blueExcludes = nums.slice(1).sort(function (a, b) { return a > b; });
        $scope.onReleaseDataChanged();
    }

    $scope.postChanges = function () {
        if ($scope.isReleaseDataChanged){

            $scope.isCommitting = true;
            $http.post('/precommit', $rootScope.releaseContent).success(function (res) {
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

                $scope.isCommitting = false;

                $location.url('/publish/commit');
            }).error(function(err) {
                alert("Failed : " + err);
            });
        }
    }
});