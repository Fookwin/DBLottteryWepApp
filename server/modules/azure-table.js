module.exports = AzureTable;

function AzureTable(storageClient) {
    this.storageClient = storageClient;
}

AzureTable.prototype = {
  find: function(tableName, query, callback) {
    self = this;
    self.storageClient.queryEntities(tableName, query, null, function entitiesQueried(error, result) {
      if(error) {
        callback(error);
      } else {
        callback(null, result.entries);
      }
    });
  }
};