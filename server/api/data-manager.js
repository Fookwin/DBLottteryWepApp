let url = require('url'),
    request = require('request'),
    global = require('../config/global.js'),
    lotto_endPoint = require('../config/config.js')[global.env].endPoint + '/RFxDBHistoryService.svc';
    attri_endPoint = require('../config/config.js')[global.env].endPoint + '/RFxDBAttributeService.svc';

module.exports = DataManager;

function DataManager(cache) {
    this.DataCache = cache;
    this.getAllLotteriesPromise = null;

    this.getAllLotteries = (callback) => {                // check if cached
        if (this.DataCache.Lotteries && this.DataCache.Lotteries.length > 0) {
            return callback(this.DataCache.Lotteries);
        }

        if (!this.getAllLotteriesPromise) {
            this.getAllLotteriesPromise = new Promise((resolve, reject) => {

                // otherwise require from server.
                const options = {
                    url: lotto_endPoint + '/Lotteries'
                };

                request(options.url, function postResponse(err, response, body) {

                    // clean the promise
                    this.getAllLotteriesPromise = null;

                    if (err) {
                        return reject(err);
                    }

                    if (response && response.statusCode === 200) {
                        var result = JSON.parse(body);

                        console.log("SUCCESS: get all lotteries" + JSON.stringify(result));
                        return resolve(result);
                    } else {
                        reject('failed to get next release data.');
                    }
                });
            });

            this.getAllLotteriesPromise.then((result) => {
                // caching the lotto
                this.DataCache.Lotteries = result.Lotteries;
                return callback(this.DataCache.Lotteries);
            }).catch((err) => {
                console.log(err);
                return callback();
            });
        }
    };

    this.GetPreviousAndNextIssue = (issue, callback) => {
        // get the list
        this.getAllLotteries((all) => {
            if (!all) {
                return callback();
            }

            const index = all.findIndex((lot) => lot.issue === issue);
            if (index < 0) {
                return callback();
            }

            return callback({
                Previous: index === 0 ? -1 : all[index - 1].issue,
                Next: index === all.length - 1 ? -1 : all[index + 1].issue
            });
        });
    };
}

DataManager.prototype = {
    getLotteries: function (req, res) {
        self = this;

        // get parameters
        const urlParams = url.parse(req.originalUrl, true).query;
        const tail = parseInt(urlParams.tail) || 0;
        const count = parseInt(urlParams.count) || 30;

        this.getAllLotteries((all) => {
            if (!all) {
                return res.status(400).json({ error: 'failed to get lotteries.' });
            }

            // get the required range
            const start = tail;
            const size = Math.min(all.length - start, count);
            let output = {
                NextIndex: start + size === all.length ? -1 : start + size,
                Lotteries: all.slice(start, start + size),
            };

            console.log(`Success: get ${size} lotteries start with ${start}` + JSON.stringify(output));
            return res.status(200).json({ error: null, data: output });
        });
    },
    getLottery: function (req, res) {
        self = this;

        // get parameters
        const urlParams = url.parse(req.originalUrl, true).query;
        const issue = parseInt(urlParams.issue);
        if (!issue) {
            console.log("Failed: invalid issue ");
            return res.status(500).json({ error: 'invalid issue.' });
        }

        // has cached?
        if (self.DataCache.LottoDetails.has(issue)) {
            const result = self.DataCache.LottoDetails.get(issue);
            self.GetPreviousAndNextIssue(issue, (output) => {
                if (!output) {
                    return res.status(500).json({ error: 'invalid issue.' });
                }

                output.Detail = result;
                console.log("SUCCESS: get the lotto detail from cache" + JSON.stringify(output));
                return res.status(200).json({ error: null, data: output });
            });
        }

        // ask server for the data
        // otherwise require from server.
        const options = {
            url: lotto_endPoint + '/Lotteries/detail?issue=' + issue
        };

        request(options.url, function postResponse(err, response, body) {

            if (err) {
                return res.status(400).json({ error: err });
            }

            if (response && response.statusCode === 200) {
                var result = JSON.parse(body);

                // cache it
                self.DataCache.LottoDetails.set(issue, result);

                self.GetPreviousAndNextIssue(issue, (output) => {
                    if (!output) {
                        return res.status(500).json({ error: 'invalid issue.' });
                    }

                    output.Detail = result;
                    console.log("SUCCESS: get the lotto detail from server" + JSON.stringify(output));
                    return res.status(200).json({ error: null, data: output });
                });
            } else {
                console.log("Failed: no valid response from server ");
                return res.status(400).json({ error: 'no valid response from server' });
            }
        });
    },
    getAttributes: function (req, res) {
        self = this;

        // has cached?
        if (self.DataCache.Attributes) {
            console.log("SUCCESS: get attributes from cache");
            return res.status(200).json({ error: null, data: self.DataCache.Attributes });
        }

        // ask server for the data
        // otherwise require from server.
        const options = {
            url: attri_endPoint + '/Attribute'
        };

        request(options.url, function postResponse(err, response, body) {

            if (err) {
                return res.status(400).json({ error: err });
            }

            if (response && response.statusCode === 200) {
                var result = JSON.parse(body);

                // cache it
                self.DataCache.Attributes = result;
                console.log("SUCCESS: get attributes from server" + JSON.stringify(self.DataCache.Attributes));
                return res.status(200).json({ error: null, data: self.DataCache.Attributes });
            } else {
                console.log("Failed: no valid response from server ");
                return res.status(400).json({ error: 'no valid response from server' });
            }
        });
    }
};

