exports.seed = (knex, Promise) => {
  // Inserts seed entries
  return knex("coordinates").insert([
    {coordinates_id: 1, user_id: 1, latitude: 1, longitude: 1, created_at: new Date()},
    {coordinates_id: 2, user_id: 2, latitude: 2, longitude: 2, created_at: new Date()},
    {coordinates_id: 3, user_id: 3, latitude: 3, longitude: 3, created_at: new Date()},
    {coordinates_id: 4, user_id: 4, latitude: 4, longitude: 4, created_at: new Date()},
    {coordinates_id: 5, user_id: 5, latitude: 5, longitude: 5, created_at: new Date()}
  ]);
};
