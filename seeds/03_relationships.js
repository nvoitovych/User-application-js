exports.seed = (knex, Promise) => {
  return knex("relationship").insert([
    {relationship_id: 1, user_id_1: 1, user_id_2: 2},
    {relationship_id: 2, user_id_1: 2, user_id_2: 1},
    {relationship_id: 3, user_id_1: 3, user_id_2: 1},
    {relationship_id: 4, user_id_1: 4, user_id_2: 1}
  ]);
};
