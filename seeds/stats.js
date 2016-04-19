exports.seed = function(knex, Promise) {
  return Promise.join(
      // Deletes ALL existing entries
      knex('stats').del(),

      // Inserts seed entries
      knex('stats').insert({
        name: 'Strength',
        code: 'str'
      }),
      knex('stats').insert({
        name: 'Dexterity',
        code: 'dex'
      }),
      knex('stats').insert({
        name: 'Constitution',
        code: 'con'
      }),
      knex('stats').insert({
        name: 'Intellegence',
        code: 'int'
      }),
      knex('stats').insert({
        name: 'Wisdom',
        code: 'wis'
      }),
      knex('stats').insert({
        name: 'Charisma',
        code: 'cha'
      })
    );
};
