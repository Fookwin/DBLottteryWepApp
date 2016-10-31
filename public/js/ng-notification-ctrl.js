angular.module('ng-release-management-app').controller('ng-notification-ctrl', function ($scope, $rootScope, $http, $location, util) {       
    $rootScope.selectedNavIndex = 3;

    // call init to make sure the content is there.
    if (!$rootScope.releaseContent) {
        util.syncReleaseDateToCloud(function () {
            init();
        });
    } else {
        init();
    }

    function init() {
        var releaseLot = $rootScope.releaseContent.lottery;

        $scope.templateList = [
                {
                    name: '开奖公告', 
                    notification: {
                        title: "第" + releaseLot.issue + "期" + " 开奖啦！", 
                        message: "红: " + releaseLot.scheme.slice(0, -3) + " 蓝: " + releaseLot.scheme.slice(-2)
                    }
                } ,
                {
                    name: '开奖详情', 
                    notification: {
                        title: "一等奖中出 " + releaseLot.bonus[0] + " 注 " + util.getMoneyFormat(releaseLot.bonus[1]), 
                        message: "奖池 " + util.getMoneyFormat(releaseLot.pool) + ", 够开出 " + Math.ceil(releaseLot.pool / 5000000) + " 个五百万！"
                    }
                },
                {
                    name: '下期推荐', 
                    notification: {
                        title: "一等奖中出 " + releaseLot.bonus[0] + " 注 " + util.getMoneyFormat(releaseLot.bonus[1]), 
                        message: "奖池 " + util.getMoneyFormat(releaseLot.pool) + ", 够开出 " + Math.ceil(releaseLot.pool / 5000000) + " 个五百万！"
                    }
                }
        ];

        $scope.selectedTemplate = $scope.templateList[0];
        $scope.notification = $scope.selectedTemplate.notification;

        $scope.notify = function () {
            $http.post('/notify', { platforms: [1,2,3], msg: JSON.stringify($scope.notification) }).then(function SuccessCallback(res) {
                alert(res.data.data);
            }, function errCallback(res) {
                alert(res.data.err);
            });
        }
    }    
});