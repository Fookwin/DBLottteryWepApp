let url = require('url'),
    request = require('request'),
    global = require('../config/global.js'),
    endPoint = require('../config/config.js')[global.env].endPoint + '/RFxDBHistoryService.svc';

module.exports = DataManager;

function DataManager() {
}

DataManager.prototype = {
    getLotteries: function (req, res) {
        self = this;

        // get issue
        var urlParams = url.parse(req.originalUrl, true).query;
        
        var tail = urlParams.tail || 0;
        var count = urlParams.count || 30;

        var options = {
            url: endPoint + '/Lotteries/?tail=' + tail + '&page=' + count
        };

        request(options.url, function postResponse(err, response, body) {

            if (err) {
                return res.status(400).json({ error: err });
            }

            if (response && response.statusCode === 200) {
                var lottoList = JSON.parse(body);

                console.log("SUCCESS: get lotteries" + JSON.stringify(lottoList));
                res.status(200).json({ error: null, data: lottoList });
            } else {
                res.status(400).json({ error: 'failed to get next release data.' });
            }
        });
    }
};

