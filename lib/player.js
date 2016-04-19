var Promise = require('bluebird');
var rfr = require("rfr");
var errors = rfr('./lib/errors');
var format = require('util').format;

function create(name, hostname, race, playerClass) {
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

            var playerRace = new self._databaseCtx.models.Race({
                name: race
            }).fetch({
                require: true
            });

            var playerClass = new self._databaseCtx.models.Class({
                name: playerClass
            }).fetch({
                require: true
            });

            

            return; // return NEW PLAYER
        })
}

module.exports = function(databaseCtx) {
    return {
        _databaseCtx: databaseCtx,
        create: create
    };
}