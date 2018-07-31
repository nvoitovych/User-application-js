exports.seed = (knex, Promise) => {
  return knex("relationship").insert([
    {relationship_id: 1, user_id_who_share_data: 1, user_id_who_receive_data: 2},
    {relationship_id: 2, user_id_who_share_data: 2, user_id_who_receive_data: 1},
    {relationship_id: 3, user_id_who_share_data: 3, user_id_who_receive_data: 1},
    {relationship_id: 4, user_id_who_share_data: 4, user_id_who_receive_data: 1}
  ]);
};
