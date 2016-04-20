exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("classes", function(table) {
            table.increments().primary();
            table.string('name').unique().notNullable();
            table.string('description');
            table.timestamps();
        })
        .then(function() {
            return knex.schema.createTableIfNotExists("races", function(table) {
                table.increments().primary();
                table.string('name').unique().notNullable();
                table.string('description');
                table.timestamps();
            })
        })
        .then(function() {
            return knex.schema.createTableIfNotExists("eventlogs", function(table) {
                table.increments().primary();
                table.string('event').notNullable();
                table.string('hostname').notNullable().references('hostname').inTable('players');
                table.timestamps();
            })
        })     
        .then(function() {
            return knex.schema.createTableIfNotExists("ircActivities", function(table) {
                table.increments().primary();
                table.string('hostname').notNullable().references('hostname').inTable('players');
                table.timestamps();
            })
        })          
        .then(function() {
            return knex.schema.createTableIfNotExists('players', function(table) {
                table.increments().primary();
                table.string('name').unique().notNullable();
                table.integer('hostname').unsigned();
                table.integer('class_id').unsigned().references('id').inTable('classes');
                table.integer('race_id').unsigned().references('id').inTable('races');
                table.integer('experience').unsigned().defaultTo(0);
                table.integer('hitpoints').defaultTo(10);
                table.integer('armorclass').defaultTo(13);
                table.integer('speed').unsigned().defaultTo(30);
                table.boolean('pvp').defaultTo(false);
                table.integer('strength').notNullable();
                table.integer('dexterity').notNullable();
                table.integer('constitution').notNullable();
                table.integer('intellegence').notNullable();
                table.integer('wisdom').notNullable();
                table.integer('charisma').notNullable();
                table.dateTime('deleted');
                table.timestamps();
            })
        })
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('users');
};
