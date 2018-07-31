
exports.up = (knex, Promise) => {
  return knex.schema.createTable("relationship", (table) => {
    table.increments("relationship_id"); // id serial primary key
    table.integer("user_id_who_share_data").unsigned();
    table.integer("user_id_who_receive_data").unsigned();

    table.foreign("user_id_who_share_data").references("user_id").inTable("user_credentials");
    table.foreign("user_id_who_receive_data").references("user_id").inTable("user_credentials");
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable("relationship");
};
