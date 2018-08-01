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

exports.getRelationshipBetweenUsers = async (userId1, userId2) => {
  const resultRelationshipJsonArray = await knex("relationship").where(
    {user_id_1: userId1, user_id_2: userId2}).orWhere({user_id_1: userId2, user_id_2: userId1});
  // another solution, but with bug: rel 1-1, rel 2-2 --- will give rel for user 1 and 2
  // const resultRelationshipJsonArray = await knex("relationship")
  //     .whereIn("user_id_1", [userId1, userId2])
  //     .WhereIn("user_id_2", [userId1, userId2]);
  return converter.relationshipJsonToObj(resultRelationshipJsonArray[0]);
};

exports.deleteAllAccounts = async () => {
  return knex("account").whereNot("account_id", 0).del();
};

exports.resetAutoIncrementInAccount = async () => {
  return knex.raw("ALTER TABLE account AUTO_INCREMENT = 1");
};

// exports.createRelationship = async (userId1, userId2) => {
//   const insertedRelationshipId = await knex("relationship").insert({user_id_1: userId1, user_id_2: userId2});
//   return getRelationshipById(insertedRelationshipId);
// };
//
// const getRelationshipById = exports.getRelationshipById = async (relationshipId) => {
//   const resultRelationshipJsonArray = await knex("relationship").where({relationship_id: relationshipId});
//   return converter.relationshipJsonToObj(resultRelationshipJsonArray[0]);
// };
