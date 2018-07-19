const dbConfig = require("./config");

const knex = require("knex")({
  client: "mysql",
  version: "8.0.11",
  connection: dbConfig.test,
  pool: dbConfig.test_pool
});

exports.registerUser = (login, password) => {
  return knex("users")
    .insert({login: login, password: password})
    .then(idOfInsertedUser => {
      return getUserById(idOfInsertedUser);
    });
};

const getUserById = exports.getUserById = (id) => {
  return knex("users")
    .where({id: id})
    .then(resultUsers => {
      return resultUsers[0];
    });
};

exports.getAllUsers = () => {
  return knex("users")
    .select("*")
    .then(resultUsers => {
      return resultUsers;
    });
};

exports.truncateTableUsers = () => {
  return knex("users")
    .truncate()
    .then(result => {
      return result;
    });
};
