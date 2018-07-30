
exports.up = (knex, Promise) => {
  return knex.schema.createTable("relationship", (table) => {
    table.increments("relationship_id"); // id serial primary key
    table.integer("account_id_who_share_data").unsigned();
    table.integer("account_id_who_receive_data").unsigned();

    table.foreign("account_id_who_share_data").references("account_id").inTable("account");
    table.foreign("account_id_who_receive_data").references("account_id").inTable("account");
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable("relationship");
};
