
exports.up = (knex, Promise) => {
  return knex.schema.createTable("user_credentials", (table) => {
    table.increments("user_id"); // id serial primary key
    table.string("login").unique();
    table.string("password_hash").notNullable();
    table.string("username");
    table.string("email");
  });
};
exports.down = (knex, Promise) => {
  return knex.schema.dropTable("user_credentials");
};
