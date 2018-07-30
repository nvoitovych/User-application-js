
exports.up = (knex, Promise) => {
  return knex.schema.createTable("coordinates", (table) => {
    table.increments("coordinates_id"); // id serial primary key
    table.double("latitude");
    table.double("longitude");
    table.integer("account_id").unsigned();
    table.datetime("created_at").notNullable();

    table.foreign("account_id").references("account_id").inTable("account");
  });
};
exports.down = (knex, Promise) => {
  return knex.schema.dropTable("coordinates");
};
