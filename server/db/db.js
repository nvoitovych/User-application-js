const converter = require("../helpers/mapper");
const env = process.env.NODE_ENV || "development";

const config = require("../../knexfile")[env];
const knex = require("knex")(config);

exports.registerUser = async (login, password) => {
  // after inserting in response we receive id(or ids) of inserts
  const idOfInsertedUserCredentials = await knex("user_credentials").insert({login: login, password_hash: password});
  return getUserCredentialsByUserCredentialsId(idOfInsertedUserCredentials);
};

exports.createAccount = async (userCredentialsId) => {
  // after inserting in response we receive id(or ids) of inserts
  const idOfInsertedAccount = await knex("account").insert({user_credentials_id: userCredentialsId, created_at: new Date()});
  return getAccountByAccountId(idOfInsertedAccount);
};

const getAccountByAccountId = exports.getAccountByAccountId = async (accountId) => {
  const resultAccountInArray = await knex("account").where({account_id: accountId}).limit(1);
  return converter.convertAccountFromJsonToObject(resultAccountInArray[0]);
};

exports.getAccountByUserCredentialsId = async (userCredentialsId) => {
  const resultAccountInArray = await knex("account").where({user_credentials_id: userCredentialsId}).limit(1);
  return converter.convertAccountFromJsonToObject(resultAccountInArray[0]);
};

const getUserCredentialsByUserCredentialsId = exports.getUserCredentialsByUserCredentialsId = async (userCredentialsId) => {
  const resultUserCredentialsInArray = await knex("user_credentials").where({user_credentials_id: userCredentialsId}).limit(1);
  return converter.convertUserCredentialsFromJsonToObject(resultUserCredentialsInArray[0]);
};

exports.getUserCoordinatesByAccountId = async (accountId) => {
  const resultCoordinatesInArray = await knex("coordinates").where({account_id: accountId});
  return converter.convertCoordinatesFromJsonArrayToObjectArray(resultCoordinatesInArray);
};

exports.getAllAccounts = async () => {
  return converter.convertAccountsFromJsonArrayToObjectArray(knex("account").select("*"));
};

exports.deleteAllAccounts = async () => {
  return knex("account").whereNot("account_id", 0).del();
};

exports.resetAutoIncrementInAccount = async () => {
  return knex.raw("ALTER TABLE account AUTO_INCREMENT = 1");
};
