var _ = require('lodash');
var Promise = require('bluebird');

module.exports = function(consoleDebug, activityMonitor, dbContext) {

    function harvest() {
        consoleDebug("Harvesting started.");
        return new dbContext.models.Player({
                deleted: null
            }).fetchAll()
            .then(function(players) {
                players = players.toJSON();
                var now = new Date();
                var newActivityRecords = activityMonitor.chatters.filter(function(chatter) {
                    if (_.some(players, ['hostname', chatter.hostname])) {
                        return {
                            hostname: chatter,
                            chattedOn: now
                        };
                    }
                });
                return Promise.try(function() {
                    if (newActivityRecords.length > 0) {
                        return dbContext.knex('ircActivities').insert(newActivityRecords).then(function(inserted) {
                            consoleDebug("Harvested " + newActivityRecords.length + " players.");
                            activityMonitor.clear();
                        });
                    }
                    else {
                        consoleDebug("There were no players to harvest.");
                    }
                });
            });
    }

    return {
        harvest: harvest
    };
};