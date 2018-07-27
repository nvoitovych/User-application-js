const converter = require("../helpers/mapper");
const env = process.env.NODE_ENV || "development";

const config = require("../../knexfile")[env];
const knex = require("knex")(config);

exports.registerUser = async (login, password) => {
  const idOfInsertedUser = await knex("user").insert({login: login, password: password});
  return getUserById(idOfInsertedUser);
};

const getUserById = exports.getUserById = async (id) => {
  const resultUserInArray = await knex("user").where({id: id}).limit(1);
  return converter.convertUserFromJsonToObject(resultUserInArray[0]);
};

exports.getAllUsers = async () => {
  return converter.convertUsersFromJsonArrayToObjectArray(knex("user").select("*"));
};

exports.truncateTableUsers = async () => {
  return knex("user").truncate();
};
