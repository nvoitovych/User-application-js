exports.up = (knex, Promise) => {
  return knex.schema.createTable("coordinates", (table) => {
    table.increments("id"); // id serial primary key
    table.double("latitude");
    table.double("longitude");
    table.integer("user_id").unsigned();
    // table.datetime("created_at").notNullable();
    table.timestamp("created_at", false);

    table.foreign("user_id").references("id").inTable("user");
  });
};
exports.down = (knex, Promise) => {
  return knex.schema.dropTable("coordinates");
};
