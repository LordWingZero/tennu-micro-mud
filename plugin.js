// var array = require('lodash/array');
var later = require("later");
var Promise = require('bluebird');
var format = require('util').format;
var knexfile = require("./knexfile");
// var moment = require("moment");
// var parseDuration = require('parse-duration');
var errors = require('./lib/errors');
// var _ = require('lodash');
var activityMonitor = require("./lib/activity-monitor");

var errorReponse = function(message) {
    return {
        intent: "notice",
        query: true,
        message: message
    }
};

var getConsoleLgger = function(logger) {
    return function(message) {
        logger(format("tennu-micro-mud: %s", message));
    }
};

var TennuMicroMUD = {

    requiresRoles: ["dbcore", "dblogger"],
    //configDefaults: {},
    init: function(client, imports) {

        var consoleDebug = getConsoleLgger(client._logger.debug);

        consoleDebug("launching MUD server.");

        const helps = require("./helps.json");
        var mudConfig = client.config("micro-mud");

        // Database
        var databaseCtx = require("./lib/database-context")(knexfile);

        //var creator = require("./lib/creator");

        // Schedules
        // var experienceHarvesterSchedule = later.parse.recur().every(5).second(); //later.parse.recur().every(1).hour();
        // var experienceHarvester = require("./lib/experience-harvester")(consoleDebug, activityMonitor, models);
        // var experienceHarvesterTimer = later.setInterval(experienceHarvester.harvest, experienceHarvesterSchedule);

        function createchar(IRCMessage) {
            if (IRCMessage.hostmask.hostname.indexOf("gamesurge") === -1) {
                return errorReponse("Please register with Gamesurge before doing that.");
            }

            var args = require('yargs').parse(IRCMessage.message);

            if (!args.name || !args.race || !args.class) {
                return errorReponse("Race and class required.");
            }

            return Promise.try(function() {

                    return new databaseCtx.models.Player({
                        name: args.name
                    }).fetch();

                })
                .then(function(foundPlayer) {

                    if (foundPlayer !== null) {
                        throw new errors.playerDataError("Player name in use.");
                    }

                    return new databaseCtx.models.Player({
                        hostname: IRCMessage.hostmask.hostname,
                        deleted: null
                    }).fetch();

                })
                .then(function(foundPlayer) {

                    if (foundPlayer !== null) {
                        throw new errors.playerDataError("Player name in use.");
                    }

                    var playerRace = new databaseCtx.models.Race({
                        name: args.race
                    }).fetch({
                        require: true
                    });

                    var playerClass = new databaseCtx.models.Class({
                        name: args.class
                    }).fetch({
                        require: true
                    });

                    return {
                        intent: "say",
                        query: false,
                        message: format("A bold %s %s walks into Failgarth, proudly announcing their name \"%s\"!", args.race, args.class, args.name)
                    };
                })
                .catch(databaseCtx.bookshelf.NotFoundError, function() {
                    return errorReponse("Couldnt find specified class or race. They are case sensitive.")
                })
                .catch(function(err) {
                    return errorReponse(err.message);
                });
        }

        return {
            handlers: {
                "privmsg": function(IRCMessage) {
                    if (IRCMessage.hostname) {
                        activityMonitor.add(IRCMessage.hostname);
                    }
                },
                "!createchar": createchar
            },
            help: helps,
            commands: Object.keys(helps)
        }
    }
};

module.exports = TennuMicroMUD;