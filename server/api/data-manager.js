let url = require('url'),
    request = require('request'),
    global = require('../config/global.js'),
    endPoint = require('../config/config.js')[global.env].endPoint + '/RFxDBHistoryService.svc';

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
                    url: endPoint + '/Lotteries'
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

    }
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

        console.log("state " + self.state);
        console.log(JSON.stringify(self.DataCache.Lotteries.get(2019071)));

        // get parameters
        const urlParams = url.parse(req.originalUrl, true).query;
        const issue = parseInt(urlParams.issue);
        if (!issue) {
            console.log("Failed: invalid issue ");
            return res.status(500).json({ error: 'invalid issue.' });
        }

        if (!self.DataCache.Lotteries.has(issue)) {
            console.log("Failed: not found the lotto in cache for issue " + issue);
            return res.status(500).json({ error: 'invalid issue.' });
        }

        console.log("SUCCESS: get lotto for issue " + issue + "\n" + JSON.stringify(self.DataCache.Lotteries.get(issue)));

        return res.status(200).json({ error: null, data: self.DataCache.Lotteries.get(issue) });

        // const options = {
        //     url: endPoint + '/Lotteries/?tail=' + tail + '&page=' + count
        // };

        // request(options.url, function postResponse(err, response, body) {

        //     if (err) {
        //         return res.status(400).json({ error: err });
        //     }

        //     if (response && response.statusCode === 200) {
        //         var lottoList = JSON.parse(body);

        //         console.log("SUCCESS: get lotteries" + JSON.stringify(lottoList));
        //         res.status(200).json({ error: null, data: lottoList });

        //         // caching the lotto
        //         lottoList.forEach(lotto => {
        //             if (!DataCache.History.Lotteries.has(lotto.issue)) {
        //                 DataCache.History.Lotteries.set(lotto.issue, lotto);
        //             }
        //         });
        //     } else {
        //         res.status(400).json({ error: 'failed to get next release data.' });
        //     }
        // });
    }
};

