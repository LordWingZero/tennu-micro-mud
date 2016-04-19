function buildModels(bookshelf, knex) {
    var Race = bookshelf.Model.extend({
        tableName: 'races',
        player: function() {
            return this.belongsTo(Player);
        }
    });

    var Class = bookshelf.Model.extend({
        tableName: 'classes',
        player: function() {
            return this.belongsTo(Player);
        }
    });

    var Stat = bookshelf.Model.extend({
        tableName: 'stats',
        players: function() {
            return this.belongsToMany(Player);
        }
    });

    // Done through many-to-many
    // var PlayerStat = bookshelf.Model.extend({
    //     tableName: 'players_stats'
    // });

    var EventLog = bookshelf.Model.extend({
        tableName: 'eventlogs',
        player: function() {
            return this.belongsTo(Player);
        }
    });

    var IRCActivity = bookshelf.Model.extend({
        tableName: 'ircActivities',
        player: function() {
            return this.belongsTo(Player);
        }
    });

    var Player = bookshelf.Model.extend({
        tableName: 'players',
        stats: function() {
            return this.belongsToMany(Stat);
        },
        class: function() {
            return this.hasOne(Class);
        },
        race: function() {
            return this.hasOne(Race);
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
            Stat: Stat,
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