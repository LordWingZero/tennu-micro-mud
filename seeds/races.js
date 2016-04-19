exports.seed = function(knex, Promise) {
  return Promise.join(
      // Deletes ALL existing entries
      knex('races').del(),

      // Inserts seed entries
      knex('races').insert({
        name: 'Human'
      }),
      knex('races').insert({
        name: 'Elf'
      }),
      // knex('races').insert({
      //   name: 'Half-Elf'
      // }),
      knex('races').insert({
        name: 'Dwarf'
      })
      // knex('races').insert({
      //   name: 'Ogre'
      // }),
      // knex('races').insert({
      //   name: 'Gnome'
      // }),
      // knex('races').insert({
      //   name: 'Halfling'
      // }),
      // knex('races').insert({
      //   name: 'Draconic'
      // }),
      // knex('races').insert({
      //   name: 'Drow'
      // })
    );
};
