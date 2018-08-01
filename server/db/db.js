const converter = require("../helpers/entityMapper");
const env = process.env.NODE_ENV || "development";

const config = require("../../knexfile")[env];
const knex = require("knex")(config);

exports.createUser = async (login, password) => {
  // after inserting in response we receive id(or ids) of inserts
  const insertedUserId = await knex("user_credentials").insert({login: login, password_hash: password});
  return getUserById(insertedUserId);
};

exports.createAccount = async (userId) => {
  // after inserting in response we receive id(or ids) of inserts
  const insertedAccountId = await knex("account").insert({user_id: userId, created_at: new Date()});
  return getAccountById(insertedAccountId);
};

const getAccountById = exports.getAccountById = async (accountId) => {
  const resultAccountJsonArray = await knex("account").where({account_id: accountId}).limit(1);
  return converter.accountJsonToObj(resultAccountJsonArray[0]);
};

exports.getAccountByUserId = async (userId) => {
  const resultAccountJsonArray = await knex("account").where({user_id: userId}).limit(1);
  return converter.accountJsonToObj(resultAccountJsonArray[0]);
};

const getUserById = exports.getUserById = async (userId) => {
  const resultUserJsonArray = await knex("user_credentials").where({user_id: userId}).limit(1);
  return converter.userJsonToObj(resultUserJsonArray[0]);
};

exports.getUserByLogin = async (login) => {
  const resultUserJsonArray = await knex("user_credentials").where({login: login}).limit(1);
  if (typeof resultUserJsonArray !== "undefined" && resultUserJsonArray.length > 0) {
    // the array is defined and has at least one element
    return converter.userJsonToObj(resultUserJsonArray[0]);
  } else {
    const error = new Error("User with specified login doesn't exist");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
};

exports.getUserCoordinatesByUserId = async (userId) => {
  const resultCoordinatesJsonArray = await knex("coordinates").where({user_id: userId});
  return converter.coordinatesJsonArrayToObjArray(resultCoordinatesJsonArray);
};

exports.getAllAccounts = async () => {
  return converter.accountsJsonArrayToObjArray(knex("account").select("*"));
};

exports.getAllUsers = async () => {
  return converter.UsersJsonArrayToObjArray(knex("user_credentials").select("*"));
};

exports.createCoordinates = async (userId, latitude, longitude) => {
  const insertedCoordinatesId = await knex("coordinates").insert({user_id: userId, latitude: latitude, longitude: longitude, created_at: new Date()});
  return getCoordinatesById(insertedCoordinatesId);
};

const getCoordinatesById = exports.getCoordinatesById = async (coordinatesId) => {
  const resultCoordinatesJsonArray = await knex("coordinates").where({coordinates_id: coordinatesId});
  return converter.coordinatesJsonToObj(resultCoordinatesJsonArray[0]);
};

exports.getRelationshipBetweenUsers = async (userIdWhoShareData, userIdWhoReceiveData) => {
  const resultRelationshipJsonArray = await knex("relationship").where(
    {user_id_who_share_data: userIdWhoShareData, user_id_who_receive_data: userIdWhoReceiveData});
  return converter.relationshipJsonToObj(resultRelationshipJsonArray[0]);
};

exports.deleteAllAccounts = async () => {
  return knex("account").whereNot("account_id", 0).del();
};

exports.resetAutoIncrementInAccount = async () => {
  return knex.raw("ALTER TABLE account AUTO_INCREMENT = 1");
};

// exports.createRelationship = async (userIdWhoShareData, userIdWhoReceiveData) => {
//   const idOfInsertedRelationship = await knex("relationship").insert({user_id_who_share_data: userIdWhoShareData, user_id_who_receive_data: userIdWhoReceiveData});
//   return getRelationshipByRelationshipId(idOfInsertedRelationship);
// };
//
// const getRelationshipByRelationshipId = exports.getRelationshipByRelationshipId = async (relationshipId) => {
//   const resultRelationshipInArray = await knex("relationship").where({relationship_id: relationshipId});
//   return converter.relationshipJsonToObj(resultRelationshipInArray[0]);
// };

// exports.getRelationshipsByUserIdWhoShareData = async (userIdWhoShareData) => {
//   const resultRelationshipInArray = await knex("relationship").where({user_id_who_share_data: userIdWhoShareData});
//   return converter.relationshipsJsonArrayToObjArray(resultRelationshipInArray);
// };
//
// exports.getRelationshipsByUserIdWhoReceiveData = async (userIdWhoReceiveData) => {
//   const resultRelationshipInArray = await knex("relationship").where({user_id_who_receive_data: userIdWhoReceiveData});
//   return converter.relationshipsJsonArrayToObjArray(resultRelationshipInArray);
// };
