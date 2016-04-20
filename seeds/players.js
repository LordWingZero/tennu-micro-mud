exports.seed = function(knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('players').del(),

        // Inserts seed entries
        knex('players').insert({
            name: 'Koldon',
            hostname: 'Ownix.linux.gamesurge',
            class_id: 1,
            race_id: 1,
            strength: 13,
            dexterity: 13,
            constitution: 16,
            intellegence: 7,
            wisdom: 13,
            charisma: 11,
            updated_at: 1461166787943,
            created_at: 1461166787943,
            id: 2,
            experience: 0,
            hitpoints: 10,
            armorclass: 13,
            speed: 30
        })
    );
};
