var Promise = require('bluebird');
var rfr = require("rfr");
var errors = rfr('./lib/errors');
var statGenerate = rfr("./lib/stat-generator");
var format = require('util').format;

function rollDefaultStartingStats() {
    return statGenerate.roll(6, 5, 3, 6);
};

// function reRollStats(hostname, databaseCtx) {
//     return new databaseCtx.models.Player({
//             hostname: hostname
//         })
//         .fetch({
//             require: true
//         })
//         .then(function(existingPlayer) {

//             if (existingPlayer.get("experience") > 0) {
//                 throw new errors.playerDataError("Re-rolling disabled when experience > 0");
//             }

//             return Promise.try(function() {
//                 var rolledStats = rollDefaultStartingStats();
//                 return getStatMap(rolledStats);
//             }).then(function(statMap) {
//                 return existingPlayer.stats().attach(statMap);
//             });
//         });
// }

function create(name, hostname, race, playerClassName) {
    var self = this;
    return Promise.try(function() {

            return new self._databaseCtx.models.Player({
                name: name
            }).fetch();

        })
        .then(function(foundPlayer) {

            if (foundPlayer !== null) {
                throw new errors.playerDataError("Player name in use.");
            }

            return new self._databaseCtx.models.Player({
                hostname: hostname,
                deleted: null
            }).fetch();

        })
        .then(function(foundPlayer) {

            if (foundPlayer !== null) {
                throw new errors.playerDataError("Player name in use.");
            }

            var playerClassPromise = new self._databaseCtx.models.Class({
                name: playerClassName
            }).fetch({
                require: true
            });

            var playerRacePromise = new self._databaseCtx.models.Race({
                name: race
            }).fetch({
                require: true
            });

            return Promise.all(
                [playerClassPromise,
                    playerRacePromise
                ]
            ).then(function(playerClassRace) {

                var playerClass = playerClassRace[0];
                var playerRace = playerClassRace[1];
                var rolledStats = rollDefaultStartingStats();
                
                self._consoleDebug(rolledStats)

                return new self._databaseCtx.models.Player({
                        name: name,
                        hostname: hostname,
                        class_id: playerClass.get("id"),
                        race_id: playerRace.get("id"),
                        strength: rolledStats[0],
                        dexterity: rolledStats[1],
                        constitution: rolledStats[2],
                        intellegence: rolledStats[3],
                        wisdom: rolledStats[4],
                        charisma: rolledStats[5],
                    })
                    .save()
                    .then(function(newPlayer) {
                        return newPlayer.refresh({
                            withRelated: ['race', 'class'],
                            require: true
                        });
                    });
            });
        });
}

function getByName(name) {
    var self = this;
    return Promise.try(function() {
        return new self._databaseCtx.models.Player({
                name: name
            })
            .fetch({
                withRelated: ['race', 'class'],
                require: true
            });
    });
}

function getByHostname(hostname) {
    var self = this;
    return Promise.try(function() {
        return new self._databaseCtx.models.Player({
                hostname: hostname
            })
            .fetch({
                withRelated: ['race', 'class'],
                require: true
            });
    });
}

function list() {
    var self = this;
    return new self._databaseCtx.models.Player()
        .fetchAll({
            withRelated: ['race', 'class'],
            require: true
        });
}

module.exports = function(databaseCtx, consoleDebug) {
    return {
        _consoleDebug: consoleDebug,
        _databaseCtx: databaseCtx,
        create: create,
        getByName: getByName,
        getByHostname: getByHostname,
        list: list
    };
}
