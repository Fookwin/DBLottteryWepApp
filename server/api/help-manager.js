var azure = require('azure-storage'),
    url = require('url');

module.exports = HelpManager;

function HelpManager(tb, topicTable, itemTable) {
    this.table = tb;
    this.topicTable = topicTable;
    this.itemTable = itemTable;

    this.getTopicItems = (itemIds, cb) => {

        const itemsQuery = new azure.TableQuery()
            .where(itemIds.map(id => `PartitionKey eq '${id}'`).join(' or '))
            .select('Description');

        // get the detailed items
        this.table.find(this.itemTable, itemsQuery, (error, items) => {
            if (error || !items || items.length === 0) {
                console.log(error);
                return cb();
            }

            return cb(items)
        });
    };
}

HelpManager.prototype = {
    getTopic: function (req, res) {
        self = this;

        const urlParams = url.parse(req.originalUrl, true).query;
        const id = urlParams.id;

        if (!id) {
            return res.status(400).json("{err: 'invalid help id'}");
        }

        const query = new azure.TableQuery()
            .where('PartitionKey eq ?', id)
            .select('Description', 'Title', 'Items');

        self.table.find(self.topicTable, query, (error, topics) => {
            if (error || !topics || topics.length === 0) {
                console.error('ERR ' + 'Fail to get help for ' + id);
                return res.status(200).json({ error: error, data: [] });
            }

            const rawTopic = topics[0];

            this.getTopicItems(rawTopic.Items._.split(' '), (items) => {
                if (!items || items.length === 0) {
                    console.error('ERR ' + 'Fail to get help for ' + id);
                    return res.status(200).json({ error: "failed to get topic items", data: [] });
                }

                let topic =
                {
                    Title: rawTopic.Title._,
                    Description: rawTopic.Description._,
                    Items: items.map(rowItem => rowItem.Description._),
                }

                console.log('Get topic ' + JSON.stringify(topic));
                res.status(200).json({ error: error, data: topic });
            });
        });
    }
};