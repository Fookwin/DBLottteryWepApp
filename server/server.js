module.exports = function(app) {
    
    var azure = require('azure-storage');
    var nconf = require('nconf');
    
    // read configrtion...
    nconf.env().file({file: 'config.json', search : true});
    
    var userTableName = nconf.get('USER_TABLE'),
        partitionKey = nconf.get('STORAGE_PK'),
        accountName = nconf.get('STORAGE_AN'),
        accountKey = nconf.get('STORAGE_AK');
    
    
    // initialize data modules
    var DataCache = require('./data/data-cache.js')
    var UserManager = require('./api/user-manager.js');
    var UserTable = require('./modules/user-table.js');
    var ReleaseManager = require('./api/release-manager.js');
    var SqlManager = require('./api/sql-manager.js');
    var DataManager = require('./api/data-manager.js');

    var _userTable = new UserTable(azure.createTableService(accountName, accountKey), userTableName);
    var _userMgr = new UserManager(_userTable);   

    var _blobServer = azure.createBlobService(accountName, accountKey) 
    var _releaseMgr = new ReleaseManager(_blobServer);

    var _sqlManager = new SqlManager();
    var _dataManager = new DataManager(DataCache);
    
    /** HTTP GET */
    app.get('/users', _userMgr.getUsers.bind(_userMgr));
    app.get('/lotto/last', _releaseMgr.getLastReleaseData.bind(_releaseMgr));
    app.get('/lotto/offical/:issue?', _releaseMgr.getOfficalLotteryData.bind(_releaseMgr));
    app.post('/lotto/new', _releaseMgr.buildNewReleaseData.bind(_releaseMgr));
    app.post('/notify', _releaseMgr.postNotification.bind(_releaseMgr));
    app.post('/precommit', _releaseMgr.preCommitRelease.bind(_releaseMgr));
    app.get('/blob', _releaseMgr.getBlobText.bind(_releaseMgr));
    app.get('/action/pending', _releaseMgr.getPendingActions.bind(_releaseMgr));
    app.post('/commit', _releaseMgr.commitRelease.bind(_releaseMgr));
    app.get('/notifications', _releaseMgr.getNotifications.bind(_releaseMgr));
    app.delete('/action/remove', _releaseMgr.removePendingAction.bind(_releaseMgr));
    app.get('/sql/obmission/:count?', _sqlManager.getObmission.bind(_sqlManager));
    app.get('/lotto/?', _dataManager.getLotteries.bind(_dataManager));
};