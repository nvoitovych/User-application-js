// Update with your config settings.

const dbConfig = require("./config");

module.exports = {
  development: {
    client: "mysql",
    version: "5.7.2",
    connection: dbConfig.test,
    pool: dbConfig.test,
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  }

  // test: {
  //   client: "mysql",
  //   version: "5.7.2",
  //   connection: dbConfig.test,
  //   pool: dbConfig.test_pool,
  //   migrations: {
  //     directory: "./migrations/test",
  //     tableName: "knex_migrations"
  //   },
  //   seeds: {
  //     directory: "./seeds/test"
  //   },
  //   debug: false
  // }

  // staging: { ... },

  // production: { ... },
};
