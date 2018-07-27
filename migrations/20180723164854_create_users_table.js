exports.up = (knex, Promise) => {
  return knex.schema.createTable("user", (table) => {
    table.increments("id"); // id serial primary key
    table.string("login").unique();
    table.string("password");
  });
};
exports.down = (knex, Promise) => {
  return knex.schema.dropTable("user");
};
