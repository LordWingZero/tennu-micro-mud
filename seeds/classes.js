exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('classes').del(),

    // Inserts seed entries
    knex('classes').insert({
      name: 'Wizard'
    }),
    // knex('classes').insert({
    //   name: 'Preist'
    // }),
    knex('classes').insert({
      name: 'Fighter'
    }),
    knex('classes').insert({
      name: 'Thief'
    }),    
    knex('classes').insert({
      name: 'Rogue'
    }),
    // knex('classes').insert({
    //   name: 'Barbarian'
    // }),
    // knex('classes').insert({
    //   name: 'Paladin'
    // }),
    knex('classes').insert({
      name: 'Ranger'
    })
    // knex('classes').insert({
    //   name: 'Monk'
    // }),
    // knex('classes').insert({
    //   name: 'Druid'
    // }),
    // knex('classes').insert({
    //   name: 'Bard'
    // })
  );
};
