
exports.up = (knex, Promise) => {
  return knex.schema.createTable("relationship", (table) => {
    table.increments("relationship_id"); // id serial primary key
    table.integer("user_id_1").unsigned();
    table.integer("user_id_2").unsigned();

    table.foreign("user_id_1").references("user_id").inTable("user_credentials");
    table.foreign("user_id_2").references("user_id").inTable("user_credentials");
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable("relationship");
};
