exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("classes", function(table) {
            table.increments();
            table.string('name').unique().notNullable();
            table.string('description');
            table.timestamps();
        })
        .then(function() {
            return knex.schema.createTableIfNotExists("races", function(table) {
                table.increments();
                table.string('name').unique().notNullable();
                table.string('description');
                table.timestamps();
            })
        })
        .then(function() {
            return knex.schema.createTableIfNotExists("stats", function(table) {
                table.increments();
                table.string('name').unique().notNullable();
                table.string('code').unique().notNullable();
                table.timestamps();
            })
        })        
        .then(function() {
            return knex.schema.createTableIfNotExists("players_stats", function(table) {
                table.increments();
                table.string('name').unique().notNullable();
                table.integer('player_id').unsigned().references('id').inTable('players');          
                table.integer('stat_id').unsigned().references('id').inTable('stats');
                table.integer('value');
                table.timestamps();
            })
        })       
        .then(function() {
            return knex.schema.createTableIfNotExists("eventlogs", function(table) {
                table.increments();
                table.string('event').notNullable();
                table.string('hostname').notNullable().references('hostname').inTable('players');
                table.timestamps();
            })
        })     
        .then(function() {
            return knex.schema.createTableIfNotExists("ircActivities", function(table) {
                table.increments();
                table.string('hostname').notNullable().references('hostname').inTable('players');
                table.timestamps();
            })
        })          
        .then(function() {
            return knex.schema.createTableIfNotExists('players', function(table) {
                table.increments();
                table.string('name').unique().notNullable();
                table.integer('hostname').unsigned();
                table.integer('class_id').unsigned().references('id').inTable('classes');
                table.integer('race_id').unsigned().references('id').inTable('races');
                table.integer('experience').unsigned();
                table.integer('hitpoints');
                table.integer('armorclass');
                table.integer('speed').unsigned();
                table.boolean('pvp');
                table.dateTime('deleted');
                table.timestamps();
            })
        })
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('users');
};
