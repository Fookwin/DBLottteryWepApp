// $(document).ready(function(){
//     var clickEvent = false;
// 	$('#myCarousel').carousel({
// 		interval:   4000	
// 	}).on('click', '.list-group li', function() {
// 			clickEvent = true;
// 			$('.list-group li').removeClass('active');
// 			$(this).addClass('active');		
// 	}).on('slid.bs.carousel', function(e) {
// 		if(!clickEvent) {
// 			var count = $('.list-group').children().length -1;
// 			var current = $('.list-group li.active');
// 			current.removeClass('active').next().addClass('active');
// 			var id = parseInt(current.data('slide-to'));
// 			if(count == id) {
// 				$('.list-group li').first().addClass('active');	
// 			}
// 		}
// 		clickEvent = false;
// 	});
// });
// $(window).load(function() {
//     var boxheight = $('#myCarousel .carousel-inner').innerHeight();
//     var itemlength = $('#myCarousel .item').length;
// 	var triggerheight = Math.round(boxheight/itemlength+1);
// 	$('#myCarousel .list-group-item').outerHeight(triggerheight);
// });

angular.module('ng-dashboard-app').directive("ngHomeView", function () {
    return {
        restrict: 'EAC',
        controller: 'ng-home-view-ctrl',
        templateUrl: '/templates/dashboard/home-view.html'
    };
});

angular.module('ng-dashboard-app').controller('ng-home-view-ctrl', function ($scope, $timeout, $http) {
    
    $scope.timeCountDown = {
        issue: 2008072,
        dueTime: new Date("2018/06/26 21:15"),
        restTime: '00天 00时 00分 00秒'
    };

    function startTime() {
        var today = new Date();

        var diff = $scope.timeCountDown.dueTime.getTime() - today.getTime();

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -=  days * (1000 * 60 * 60 * 24);
        
        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        
        var mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);
        
        var seconds = Math.floor(diff / (1000));
        diff -= seconds * (1000);

        $scope.timeCountDown.restTime = checkTime(days) + '天 ' + checkTime(hours) + '时 ' + checkTime(mins) + '分 ' + checkTime(seconds) + '秒';

        var t = $timeout(startTime, 1000);
    }

    function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

    startTime();
});