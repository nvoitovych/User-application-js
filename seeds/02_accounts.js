exports.seed = (knex, Promise) => {
  return knex("account").insert([
    {account_id: 1, user_id: 1, created_at: new Date()},
    {account_id: 2, user_id: 2, created_at: new Date()},
    {account_id: 3, user_id: 3, created_at: new Date()},
    {account_id: 4, user_id: 4, created_at: new Date()},
    {account_id: 5, user_id: 5, created_at: new Date()}
  ]);
};
