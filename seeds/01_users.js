const bcrypt = require("bcrypt");

exports.seed = async (knex, Promise) => {
  const pass1 = await bcrypt.hash("admin1", 10);
  const pass2 = await bcrypt.hash("admin2", 10);
  const pass3 = await bcrypt.hash("admin3", 10);
  const pass4 = await bcrypt.hash("admin4", 10);
  const pass5 = await bcrypt.hash("admin5", 10);

  // Inserts seed entries
  return knex("user_credentials").insert([
    {user_id: 1, login: "admin1", password_hash: pass1},
    {user_id: 2, login: "admin2", password_hash: pass2},
    {user_id: 3, login: "admin3", password_hash: pass3},
    {user_id: 4, login: "admin4", password_hash: pass4},
    {user_id: 5, login: "admin5", password_hash: pass5}
  ]);
};
