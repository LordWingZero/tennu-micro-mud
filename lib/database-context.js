function buildModels(bookshelf, knex) {
    var Race = bookshelf.Model.extend({
        tableName: 'races',
        hasTimestamps: true,
        player: function() {
            return this.hasOne(Player);
        }
    });

    var Class = bookshelf.Model.extend({
        tableName: 'classes',
        hasTimestamps: true,
        player: function() {
            return this.hasOne(Player);
        }
    });

    var EventLog = bookshelf.Model.extend({
        tableName: 'eventlogs',
        hasTimestamps: true,
        player: function() {
            return this.belongsTo(Player);
        }
    });

    var IRCActivity = bookshelf.Model.extend({
        tableName: 'ircActivities',
        hasTimestamps: true,
        player: function() {
            return this.belongsTo(Player);
        }
    });

    var Player = bookshelf.Model.extend({
        tableName: 'players',
        hasTimestamps: true,
        class: function() {
            return this.belongsTo(Class);
        },
        race: function() {
            return this.belongsTo(Race);
        },
        eventLog: function() {
            return this.hasMany(EventLog);
        },
        ircActivity: function() {
            return this.hasMany(IRCActivity);
        }
    });

    return {
        knex: knex,
        bookshelf: bookshelf,
        models: {
            Player: Player,
            Race: Race,
            Class: Class,
            EventLog: EventLog,
            IRCActivity: IRCActivity
        }
    };

}

module.exports = function(knexfile) {
    var knex = require('knex')(knexfile[process.env.NODE_ENV]);
    var bookshelf = require('bookshelf')(knex);
    return buildModels(bookshelf, knex);
}