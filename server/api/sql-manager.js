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

function _buildObmissionPromise(connection, count, IsRed) {
    return new Promise ((resolve, reject) => {
        let query = 'SELECT TOP ' + count + ' * FROM ' + (IsRed ? 'dbo.RedObmission' : 'dbo.BlueObmission') + ' ORDER BY Issue DESC';
        
        let data = [];
        let request = new Request(query, (err, rowCount, rows) => {
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
    });
};

function _getObmission(connection, count, callback) {
    _buildObmissionPromise(connection, count, true).then((red_data) => {
        _buildObmissionPromise(connection, count, false).then((blue_data) => {

            // build the data by merging two table
            let obmission = [];
            red_data.forEach(function (red_row, index) {
                let row = [red_row[0]]; // index

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
                obmission.push(row);
            });

            return callback({data : obmission.reverse()});
        }).catch((err) => {
            return callback({err : err});
        });
    }).catch((err) => {
        return callback({err : err});
    });
}

class SqlManager {
    constructor() {
        this.obmissionCache = undefined;
    }

    // get the obmission data for both red and blue numbers.
    getObmission(req, res) {

        if (this.obmissionCache) {
            return res.status(200).json({data: this.obmissionCache});
        }

        let count = req.query.count || 30;

        // build a connection for each query
        let connection = new Connection(config);
        connection.on('connect', err => {
            if (err) {
                console.log(err)
                connection.close();
                return res.status(500).json({err: JSON.stringify(err)});
            }

            return _getObmission(connection, count, r => {
                // close the connection when done
                connection.close();

                if (r.err) {
                    console.log(r.err)
                    connection.close();
                    return res.status(500).json({err: JSON.stringify(r.err)});
                }

                // cache the data
                this.obmissionCache = r.data;

                return res.status(200).json({data: this.obmissionCache});
            });
        });
    }
}

module.exports = SqlManager;