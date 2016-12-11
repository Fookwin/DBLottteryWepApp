angular.module('ng-release-management-app').controller('ng-publish-release-data-ctrl',
    function ($scope, $http, $location, util, session) {

        // data for root scope
        $scope.releaseContent = session.data.releaseContent;

        session.data.selectedNavIndex = 0;

        $scope.syncToCloud = function () {
            if ($scope.isSyncingToCloud)
                return;

            $scope.isSyncingToCloud = true;

            var self = this;
            $http.get('/last').success(function (res) {
                session.data.originalReleaseContent = res.data;

                // convert string to date
                session.data.originalReleaseContent.next.date = new Date(session.data.originalReleaseContent.next.date);
                session.data.originalReleaseContent.next.cutOffTime = new Date(session.data.originalReleaseContent.next.cutOffTime);
                session.data.originalReleaseContent.lottery.date = new Date(session.data.originalReleaseContent.lottery.date);

                session.data.releaseContent = angular.copy(session.data.originalReleaseContent);
                $scope.releaseContent = session.data.releaseContent;
                $scope.isSyncingToCloud = false;
            });
        }

        if (!session.data.originalReleaseContent) {
            // initialize the original data from cloud.
            $scope.syncToCloud();
        }

        $scope.onLotteryDataChanged = function () {
            $scope.isReleaseDataChanged = true;

            // increase the lottery version accordingly
            if (session.data.originalReleaseContent.dataVersion.latestLotteryVersion === session.data.releaseContent.dataVersion.latestLotteryVersion) {
                session.data.releaseContent.dataVersion.latestLotteryVersion++;
            }
        }

        $scope.onReleaseDataChanged = function () {
            $scope.isReleaseDataChanged = true;

            // increase the lottery version accordingly
            if (session.data.originalReleaseContent.dataVersion.releaseDataVersion === session.data.releaseContent.dataVersion.releaseDataVersion) {
                session.data.releaseContent.dataVersion.releaseDataVersion++;
            }
        }

        $scope.onDataVersionChanged = function () {
            $scope.isReleaseDataChanged = true;
        }

        $scope.syncToOffical = function () {
            if ($scope.isSyncingToOffical)
                return;

            $scope.isSyncingToOffical = true;

            $http.get('/offical/?issue=' + session.data.originalReleaseContent.lottery.issue).success(function (res) {

                if (res.data) {
                    session.data.releaseContent.lottery = res.data;

                    session.data.releaseContent.lottery.date = new Date(session.data.releaseContent.lottery.date);

                    $scope.onLotteryDataChanged(); // should only be detail changed.
                }

                $scope.isSyncingToOffical = false;
            }).error(function (err) {
                $scope.isSyncingToOffical = false;
            });
        }

        $scope.addNewRelease = function () {
            if ($scope.isAddingNew)
                return;

            $scope.isAddingNew = true;

            $http.post('/new', {
                issue: session.data.originalReleaseContent.next.issue,
                date: session.data.originalReleaseContent.next.date
            }).success(function (res) {

                if (res.data) {
                    session.data.releaseContent = res.data;

                    // convert string to date
                    session.data.releaseContent.next.date = new Date(session.data.releaseContent.next.date);
                    session.data.releaseContent.next.cutOffTime = new Date(session.data.releaseContent.next.cutOffTime);
                    session.data.releaseContent.lottery.date = new Date(session.data.releaseContent.lottery.date);

                    // copy the current version, but change the latest issue and lottery version
                    session.data.releaseContent.dataVersion = angular.copy(session.data.originalReleaseContent.dataVersion);
                    session.data.releaseContent.dataVersion.latestIssue = session.data.originalReleaseContent.next.issue;
                    session.data.releaseContent.dataVersion.latestLotteryVersion = 1; // set 1 as the init version.
                    session.data.releaseContent.dataVersion.attributeDataVersion = 1; // set 1 as the init version.
                    session.data.releaseContent.dataVersion.releaseDataVersion = 1; // set 1 as the init version.
                }

                $scope.isAddingNew = false;
            }).error(function (err) {
                $scope.isAddingNew = false;
            });

            $scope.isReleaseDataChanged = true;
        }

        $scope.resetReleaseData = function () {
            session.data.releaseContent = angular.copy(session.data.originalReleaseContent);
            $scope.isReleaseDataChanged = false;
        };

        $scope.RandomReds = function () {

            var nums = util.getRandomNumbers(8, 33);
            session.data.releaseContent.recommendation.redIncludes = nums.slice(0, 2).sort(function (a, b) { return a > b; });
            session.data.releaseContent.recommendation.redExcludes = nums.slice(2).sort(function (a, b) { return a > b; });
            $scope.onReleaseDataChanged();
        }

        $scope.RandomBlues = function () {

            var nums = util.getRandomNumbers(4, 16);
            session.data.releaseContent.recommendation.blueIncludes = nums.slice(0, 1).sort(function (a, b) { return a > b; });
            session.data.releaseContent.recommendation.blueExcludes = nums.slice(1).sort(function (a, b) { return a > b; });
            $scope.onReleaseDataChanged();
        }

        $scope.formatScheme = function () {
            var copyText = $scope.releaseContent.lottery.scheme;
            if (copyText.length === 14) {
                var newText = copyText.slice(0, 2);
                for (var i = 1; i < 6; ++ i) {
                    newText += ' ' + copyText.slice(i * 2, i * 2 + 2);
                }

                newText += '+' + copyText.slice(12);

                $scope.releaseContent.lottery.scheme = newText;
            }
        }

        $scope.postChanges = function () {
            if ($scope.isReleaseDataChanged) {

                $scope.isCommitting = true;

                // have convert the date object to formated date string
                var tempContent = angular.copy(session.data.releaseContent);
                tempContent.next.date = util.formateDate(tempContent.next.date);
                tempContent.next.cutOffTime = util.formateDate(tempContent.next.cutOffTime);
                tempContent.lottery.date = util.formateDate(tempContent.lottery.date);

                $http.post('/precommit', tempContent).success(function (res) {
                    session.data.commitPackage = {
                        container: res.data.Container,
                        actions: []
                    };

                    res.data.Files.forEach(function (fileName) {
                        session.data.commitPackage.actions.push({
                            file: fileName,
                            content: undefined,
                            state: 'pending'
                        });
                    });

                    $scope.isCommitting = false;

                    $location.url('/publish/commit');
                }).error(function (err) {
                    alert("Failed : " + err);
                });
            }
        }
    });