const converter = require("../helpers/mapper");
const env = process.env.NODE_ENV || "development";

const config = require("../../knexfile")[env];
const knex = require("knex")(config);

exports.createUser = async (login, password) => {
  // after inserting in response we receive id(or ids) of inserts
  const idOfInsertedUser = await knex("user_credentials").insert({login: login, password_hash: password});
  return getUserByUserId(idOfInsertedUser);
};

exports.createAccount = async (userId) => {
  // after inserting in response we receive id(or ids) of inserts
  const idOfInsertedAccount = await knex("account").insert({user_id: userId, created_at: new Date()});
  return getAccountByAccountId(idOfInsertedAccount);
};

const getAccountByAccountId = exports.getAccountByAccountId = async (accountId) => {
  const resultAccountInArray = await knex("account").where({account_id: accountId}).limit(1);
  return converter.convertAccountFromJsonToObject(resultAccountInArray[0]);
};

exports.getAccountByUserId = async (userId) => {
  const resultAccountInArray = await knex("account").where({user_id: userId}).limit(1);
  return converter.convertAccountFromJsonToObject(resultAccountInArray[0]);
};

const getUserByUserId = exports.getUserByUserId = async (userId) => {
  const resultUserCredentialsInArray = await knex("user_credentials").where({user_id: userId}).limit(1);
  return converter.convertUserFromJsonToObject(resultUserCredentialsInArray[0]);
};

exports.getUserByLogin = async (login) => {
  const resultUserCredentialsInArray = await knex("user_credentials").where({login: login}).limit(1);
  if (typeof resultUserCredentialsInArray !== "undefined" && resultUserCredentialsInArray.length > 0) {
    // the array is defined and has at least one element
    return converter.convertUserFromJsonToObject(resultUserCredentialsInArray[0]);
  } else {
    const error = new Error("User with specified login doesn't exist");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
};

exports.getUserCoordinatesByUserId = async (userId) => {
  const resultCoordinatesInArray = await knex("coordinates").where({user_id: userId});
  return converter.convertCoordinatesFromJsonArrayToObjectArray(resultCoordinatesInArray);
};

exports.getAllAccounts = async () => {
  return converter.convertAccountsFromJsonArrayToObjectArray(knex("account").select("*"));
};

exports.getAllUsers = async () => {
  return converter.convertUsersCredentialsFromJsonArrayToObjectArray(knex("user_credentials").select("*"));
};

// exports.createRelationship = async (userIdWhoShareData, userIdWhoReceiveData) => {
//   const idOfInsertedRelationship = await knex("relationship").insert({user_id_who_share_data: userIdWhoShareData, user_id_who_receive_data: userIdWhoReceiveData});
//   return getRelationshipByRelationshipId(idOfInsertedRelationship);
// };
//
// const getRelationshipByRelationshipId = exports.getRelationshipByRelationshipId = async (relationshipId) => {
//   const resultRelationshipInArray = await knex("relationship").where({relationship_id: relationshipId});
//   return converter.convertRelationshipFromJsonToObject(resultRelationshipInArray[0]);
// };

// exports.getRelationshipsByUserIdWhoShareData = async (userIdWhoShareData) => {
//   const resultRelationshipInArray = await knex("relationship").where({user_id_who_share_data: userIdWhoShareData});
//   return converter.convertRelationshipsFromJsonArrayToObjectArray(resultRelationshipInArray);
// };
//
// exports.getRelationshipsByUserIdWhoReceiveData = async (userIdWhoReceiveData) => {
//   const resultRelationshipInArray = await knex("relationship").where({user_id_who_receive_data: userIdWhoReceiveData});
//   return converter.convertRelationshipsFromJsonArrayToObjectArray(resultRelationshipInArray);
// };

exports.createCoordinates = async (userId, latitude, longitude) => {
  const idOfInsertedCoordinates = await knex("coordinates").insert({user_id: userId, latitude: latitude, longitude: longitude, created_at: new Date()});
  return getCoordinatesByCoordinatesId(idOfInsertedCoordinates);
};

const getCoordinatesByCoordinatesId = exports.getCoordinatesByCoordinatesId = async (coordinatesId) => {
  const resultCoordinatesInArray = await knex("coordinates").where({coordinates_id: coordinatesId});
  return converter.convertCoordinatesFromJsonToObject(resultCoordinatesInArray[0]);
};

exports.getRelationshipBetweenUsers = async (userIdWhoShareData, userIdWhoReceiveData) => {
  const resultRelationshipInArray = await knex("relationship").where(
    {user_id_who_share_data: userIdWhoShareData, user_id_who_receive_data: userIdWhoReceiveData});
  return converter.convertRelationshipFromJsonToObject(resultRelationshipInArray[0]);
};

exports.deleteAllAccounts = async () => {
  return knex("account").whereNot("account_id", 0).del();
};

exports.resetAutoIncrementInAccount = async () => {
  return knex.raw("ALTER TABLE account AUTO_INCREMENT = 1");
};
