// // Used to determine when harvesting XP started
// var initTime = new Date();

// // When we last harvested XP
// var lastXPHarvest = new Date();

var harvest = function() {
    var self = this;
    self.consoleDebug("XP Harvest Started");

    // get all players
    // var players = 
    // assign XP
    

}

module.exports = function(consoleDebug, activityMonitor, models) {
    return {
        models: models,
        consoleDebug: consoleDebug,
        activityMonitor: activityMonitor,
        harvest: harvest
    };
};