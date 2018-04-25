'use strict';

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = {
  userName: 'pi3011314',
  password: 'zzx&jjj1314',
  server: 'ppuvjzarol.database.windows.net',
  options: {
    database: 'dbhistory',
    encrypt: true
  }
};

module.exports = SqlManager;

function SqlManager() {
    this.obmissionCache = undefined;
    this.buildObmissionPromise = function (count, IsRed) {
        return new Promise ((resolve, reject) => {

            let connection = new Connection(config);
            connection.on('connect', err => {
              return err ? console.log(err) : _execute();
            });

            function _execute() {
                const query = 'SELECT TOP ' + count + ' * FROM ' + (IsRed ? 'dbo.RedObmission' : 'dbo.BlueObmission') + ' ORDER BY Issue DESC';
                
                let data = [];
                const request = new Request(query, (err, rowCount, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log('rowCount:' + rowCount);
                        resolve(data);
                    }
                });
                
                request.on('row', columns => {
                    let row = [];
                    columns.forEach(column => row.push(column.value));
                    data.push(row);
                });
                
                connection.execSql(request);
            };
        });
    };
}

SqlManager.prototype = {
    getObmission: function(req, res) {
        self = this;

        if (self.obmissionCache) {
            return res.status (200).json({data: self.obmissionCache});
        }

        var count = req.query.count || 30;

        self.buildObmissionPromise(count, true).then((red_data) => {
            self.buildObmissionPromise(count, false).then((blue_data) => {
    
                // build the data by merging two table
                self.obmissionCache = [];
                red_data.forEach(function (red_row, index) {
                    var row = [red_row[0]]; // index
    
                    // get the lottery
                    row = row.concat(red_row.map(function (x, index) { 
                        return (x === 0 || x === '0') ? index - 1 : 0; 
                    }).filter(function (x) { 
                        return x !== 0;
                    }));
    
                    row = row.concat(blue_data[index].map(function (x, index) { 
                        return (x === 0 || x === '0') ? index - 2 : 0; 
                    }).filter(function (x) { 
                        return x !== 0;
                    }));
    
                    row = row.concat(red_row.slice(2, 35));
                    row = row.concat(blue_data[index].slice(3, 19));
                    self.obmissionCache.push(row);
                });
    
                return res.status (200).json({data: self.obmissionCache.reverse()});
            });
        });
    }
};