// var array = require('lodash/array');
var later = require("later");
var Promise = require('bluebird');
var format = require('util').format;
var path = require('path');
var knexfile = require("./knexfile");
// var moment = require("moment");
// var parseDuration = require('parse-duration');
var collectionUtils = require("./lib/collection-utils");
var errors = require('./lib/errors');
var _ = require('lodash');
var nunjucks = require("nunjucks");

var viewPath = path.join(__dirname, "views");

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

    //configDefaults: {},
    init: function(client, imports) {

        var consoleDebug = getConsoleLgger(client._logger.debug);

        consoleDebug("launching MUD server.");

        const helps = require("./helps.json");
        var mudConfig = client.config("micro-mud");

        // View engine
        nunjucks.configure(viewPath, {
            autoescape: false
        });

        // Database
        var databaseCtx = require("./lib/database-context")(knexfile);
        var player = require("./lib/player")(databaseCtx, consoleDebug);
        var classes = require("./lib/classes")(databaseCtx);
        var races = require("./lib/races")(databaseCtx);

        // Schedules
        var activityMonitor = require("./lib/activity-monitor");
        var scoreHarvesterSchedule = later.parse.recur().every(5).second(); //later.parse.recur().every(1).hour();
        var scoreHarvester = require("./lib/experience-harvester")(consoleDebug, activityMonitor, databaseCtx);
        var experienceHarvesterTimer = later.setInterval(scoreHarvester.harvest, scoreHarvesterSchedule);

        function createchar(IRCMessage) {


            if (IRCMessage.hostmask.hostname.indexOf("gamesurge") === -1) {
                return errorReponse("Please register with Gamesurge before doing that.");
            }

            var args = require('yargs').parse(IRCMessage.message);

            if (!args.name || !args.race || !args.class) {
                return errorReponse("Race and class required.");
            }

            return player.create(args.name, IRCMessage.hostmask.hostname, args.race, args.class)
                .then(function(newPlayer) {
                    var createdView = nunjucks.render('created.nunjucks', {
                        player: newPlayer.toJSON()
                    });

                    return {
                        intent: "say",
                        query: false,
                        message: createdView
                    };
                })
                .catch(databaseCtx.bookshelf.NotFoundError, function() {
                    return errorReponse("Couldnt find specified class or race. They are case sensitive.")
                })
                .catch(function(err) {
                    return errorReponse(err.message);
                });
        }

        function charstats(IRCMessage) {

            var args = require('yargs').parse(IRCMessage.message);
            var isName = args.name;

            var foundPlayerPromise;

            if (isName) {
                foundPlayerPromise = player.getByName(args.name);
            }
            else {
                foundPlayerPromise = player.getByHostname(IRCMessage.hostmask.hostname);
            }

            return foundPlayerPromise.then(function(foundPlayer) {
                    var createdView = nunjucks.render('stats.nunjucks', {
                        player: foundPlayer.toJSON()
                    });

                    return {
                        intent: "say",
                        query: false,
                        message: createdView.split(/\n/)
                    };
                })
                .catch(databaseCtx.bookshelf.NotFoundError, function() {
                    return errorReponse(format("Couldnt find specified character for %s.", (isName ? args.name : IRCMessage.hostmask.hostname)))
                })
                .catch(function(err) {
                    return errorReponse(err.message);
                });

        }

        function listchars(IRCMessage) {
            return player.list().then(function(players) {
                return {
                    intent: "say",
                    query: false,
                    message: format("Current characters: %s. !charstats [--name=\"<charname>\"] for more info.", collectionUtils.reduceToListByProperty(players.toJSON(), 'name'))
                };
            });            
        }

        function listraces(IRCMessage) {
            return races.list().then(function(races) {
                return {
                    intent: "say",
                    query: false,
                    message: "Races: " + collectionUtils.reduceToListByProperty(races.toJSON(), 'name')
                };
            });
        }

        function listclasses(IRCMessage) {
            return classes.list().then(function(classes) {
                return {
                    intent: "say",
                    query: false,
                    message: "Classes: " + collectionUtils.reduceToListByProperty(classes.toJSON(), 'name')
                };
            });
        }

        return {
            handlers: {
                "privmsg": function(IRCMessage) {
                    if (IRCMessage.hostmask.hostname) {
                        activityMonitor.add(IRCMessage.hostmask.hostname);
                    }
                },
                "!createchar": createchar,
                "!charstats": charstats,
                "!chars": listchars,
                "!races": listraces,
                "!classes": listclasses,
            },
            help: helps,
            commands: Object.keys(helps)
        }
    }
};

module.exports = TennuMicroMUD;