const convertUsersFromJsonArrayToObjectArray = exports.convertUsersFromJsonArrayToObjectArray = (arrayOfUsersInJsonObjects) => {
  // return array of user objects
  return arrayOfUsersInJsonObjects.map((userInJsonObject) => {
    // return user object(add it to array which will be returned)
    return convertUserFromJsonToObject(userInJsonObject);
  });
};

const convertUsersFromObjectArrayToJsonArray = exports.convertUsersFromObjectArrayToJsonArray = (arrayOfUsersInObjects) => {
  // return array of user JSON objects
  return arrayOfUsersInObjects.map((userInObject) => {
    // return user JSON object(add it to array which will be returned)
    return convertUserFromObjectToJson(userInObject);
  });
};

const convertUserFromJsonToObject = exports.convertUserFromJsonToObject = (userInJsonObject) => {
  // return user object
  return {
    id: userInJsonObject.id,
    login: userInJsonObject.login,
    password: userInJsonObject.password
  };
};

const convertUserFromObjectToJson = exports.convertUserFromObjectToJson = (userInObject) => {
  // return user JSON object
  return {
    "id": userInObject.id,
    "login": userInObject.login,
    "password": userInObject.password
  };
};
