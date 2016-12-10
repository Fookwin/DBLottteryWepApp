angular.module('ng-release-management-app').service('util', function ($http, session) {

    this.getRandomNumber = function random(max) {
        return Math.ceil(Math.ceil(Math.random() * max * 100) / 100);
    }

    this.getRandomNumbers = function(count, max) {
        var nums = [];
        while (nums.length < count) {
            var rN = this.getRandomNumber(max);
            if (!nums.find(function (num) { return num === rN } )) {
                nums.push(rN);
            }
        }

        return nums;
    }

    this.getMoneyFormat = function fomatMoney(money) {
        var output = "";
        var yi = Math.floor(money / 100000000);
        if (yi > 0)
            output += yi + "亿";

        var wan = Math.floor((money % 100000000) / 10000);
        if (wan > 0)
            output += wan + "万";

        var yuan = money % 10000;
        if (yuan > 0)
            output += yuan;

        output += "元";

        return output;
    }

    this.formateDate = function (dateTime, format) {

        if (!format) format = "yyyy-MM-dd hh:mm:ss";

        var date = {
              "M+": dateTime.getMonth() + 1,
              "d+": dateTime.getDate(),
              "h+": dateTime.getHours(),
              "m+": dateTime.getMinutes(),
              "s+": dateTime.getSeconds(),
              "q+": Math.floor((dateTime.getMonth() + 3) / 3),
              "S+": dateTime.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (dateTime.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
       }
       return format;
    }

    this.syncReleaseDateToCloud = function(callback) {
        var self = this;
        $http.get('/last').success(function (res) {
            session.data.originalReleaseContent = res.data;
            
            // convert string to date
            session.data.originalReleaseContent.next.date = new Date(session.data.originalReleaseContent.next.date);
            session.data.originalReleaseContent.next.cutOffTime = new Date(session.data.originalReleaseContent.next.cutOffTime);
            session.data.originalReleaseContent.lottery.date = new Date(session.data.originalReleaseContent.lottery.date);

            session.data.releaseContent = angular.copy(session.data.originalReleaseContent);
            
            callback();
        });
    }
});