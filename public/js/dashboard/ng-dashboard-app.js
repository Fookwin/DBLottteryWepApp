// function htmlbodyHeightUpdate() {
//     var height3 = $(window).height();
//     var height1 = $('.nav').height() + 50;
//     height2 = $('.container-main').height();
//     if (height2 > height3) {
//         $('html').height(Math.max(height1, height3, height2) + 10);
//         $('body').height(Math.max(height1, height3, height2) + 10);
//     } else
//     {
//         $('html').height(Math.max(height1, height3, height2));
//         $('body').height(Math.max(height1, height3, height2));
//     }

// }

// $(document).ready(function () {
//     htmlbodyHeightUpdate();
//     $(window).resize(function () {
//         htmlbodyHeightUpdate();
//     });
//     $(window).scroll(function () {
//         height2 = $('.container-main').height();
//         htmlbodyHeightUpdate();
//     });
// });


// var app = angular.module('ng-dashboard-app', ['ngRoute']);
// app.run(function () {
// });

// app.service('session', function () {
//     this.data = {
//         originalReleaseContent : undefined,
//         releaseContent : undefined,
//         commitPackage : undefined,
//         selectedNavIndex : 0,
//         title : '管理'        
//     }; 
// });

// app.config(['$routeProvider', function ($routeProvider) {
//     $routeProvider
//         .when('/', { redirectTo: '/release' })
//         .when('/users', { templateUrl: '/templates/user-picker-view.html' })
//         .otherwise({ redirectTo: '/' });
// }]);

// app.directive("ngGeneralHeaderDirective", function () {
//     return {
//         restrict: 'EAC',
//         controller: 'ng-index-header-ctrl',
//         templateUrl: '/templates/header.html'
//     };
// });

// app.controller('ng-index-header-ctrl', function ($scope, $interval, session) {
//     $scope.session = session.data;

//     $scope.navButtons = [
//         { title: 'PUBLISH', href: '#/publish' },
//         { title: 'COMMIT', href: '#/publish/commit' },
//         { title: 'NOTIFICATION', href: '#/notification' },
//         { title: 'USERS', href: '#/users' },
//     ];

//     $scope.navigateTo = function (index) {
//         session.data.selectedNavIndex = index;
//     };
// });

// app.controller('ng-index-footer-ctrl', function ($scope, $http) {
//     $http.get('/templates/footer.html').then(function (res) {
//         $scope.footer = res.data;
//     });
// });

// app.directive("ngUserPickerView", function () {
//     return {
//         restrict: 'EAC',
//         controller: 'ng-user-picker-ctrl',
//         templateUrl: '/templates/user-picker-view.html'
//     };
// });

