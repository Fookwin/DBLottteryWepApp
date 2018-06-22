$(document).ready(function(){
    var clickEvent = false;
	$('#myCarousel').carousel({
		interval:   4000	
	}).on('click', '.list-group li', function() {
			clickEvent = true;
			$('.list-group li').removeClass('active');
			$(this).addClass('active');		
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.list-group').children().length -1;
			var current = $('.list-group li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count == id) {
				$('.list-group li').first().addClass('active');	
			}
		}
		clickEvent = false;
	});
});
$(window).load(function() {
    var boxheight = $('#myCarousel .carousel-inner').innerHeight();
    var itemlength = $('#myCarousel .item').length;
	var triggerheight = Math.round(boxheight/itemlength+1);
	$('#myCarousel .list-group-item').outerHeight(triggerheight);
});

angular.module('ng-dashboard-app').directive("ngHomeView", function () {
    return {
        restrict: 'EAC',
        controller: 'ng-home-view-ctrl',
        templateUrl: '/templates/dashboard/home-view.html'
    };
});

angular.module('ng-dashboard-app').controller('ng-home-view-ctrl', function ($scope, $timeout, $http) {
    
    $scope.inLoadingData = false;
    $scope.platformList = [
        {name: 'Windows Store', index: '1'},
        {name: 'Windows Phone', index: '2'},
        {name: 'Android', index: '3'}
        ];

    $scope.scopeList = [
        {name: 'in one day', scope: '1'},
        {name: 'in one week', scope: '7'},
        {name: 'in one month', scope: '30'}
        ];

    $scope.selectedPlatform = $scope.platformList[0];
    $scope.selectedScope = $scope.scopeList[0];
    $scope.showNotificationView = false;

    $scope.refreshTable = function() {
        
        if ($scope.selectedPlatform !== undefined && $scope.selectedScope !== undefined) {
            $scope.inLoadingData = true;
            $http.get('/users/?platform=' + $scope.selectedPlatform.index + '&scope=' + $scope.selectedScope.scope).success(function (res) {
               $scope.userList = res.data;
               $scope.countOfResult = $scope.userList.length; 
               $scope.inLoadingData = false;
            });
        }
    }  
});