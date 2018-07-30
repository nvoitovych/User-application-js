exports.convertUsersCredentialsFromJsonArrayToObjectArray = (arrayOfUsersCredentialsInJsonObjects) => {
  // return array of user credentials objects
  return arrayOfUsersCredentialsInJsonObjects.map((userCredentialsInJsonObject) => {
    // return user credentials object(add it to array which will be returned)
    return convertUserCredentialsFromJsonToObject(userCredentialsInJsonObject);
  });
};

exports.convertUsersCredentialsFromObjectArrayToJsonArray = (arrayOfUsersCredentialsInObjects) => {
  // return array of user credentials JSON objects
  return arrayOfUsersCredentialsInObjects.map((userCredentialsInObject) => {
    // return user credentials JSON object(add it to array which will be returned)
    return convertUserCredentialsFromObjectToJson(userCredentialsInObject);
  });
};

const convertUserCredentialsFromJsonToObject = exports.convertUserCredentialsFromJsonToObject = (userCredentialsInJsonObject) => {
  // return user credentials object
  return {
    userCredentialsId: userCredentialsInJsonObject.user_credentials_id,
    login: userCredentialsInJsonObject.login,
    passwordHash: userCredentialsInJsonObject.password_hash
  };
};

const convertUserCredentialsFromObjectToJson = exports.convertUserCredentialsFromObjectToJson = (userCredentialsInObject) => {
  // return user credentials JSON object
  return {
    "user_credentials_id": userCredentialsInObject.userCredentialsId,
    "login": userCredentialsInObject.login,
    "password_hash": userCredentialsInObject.passwordHash
  };
};

exports.convertAccountsFromJsonArrayToObjectArray = (arrayOfAccountsInJsonObjects) => {
  // return array of accounts objects
  return arrayOfAccountsInJsonObjects.map((accountInJsonObject) => {
    // return account object(add it to array which will be returned)
    return convertAccountFromJsonToObject(accountInJsonObject);
  });
};

exports.convertAccountsFromObjectArrayToJsonArray = (arrayOfAccountsInObjects) => {
  // return array of accounts JSON objects
  return arrayOfAccountsInObjects.map((accountInObject) => {
    // return account JSON object(add it to array which will be returned)
    return convertAccountFromObjectToJson(accountInObject);
  });
};

const convertAccountFromJsonToObject = exports.convertAccountFromJsonToObject = (accountInJsonObject) => {
  // return account object
  return {
    accountId: accountInJsonObject.account_id,
    userCredentialsId: accountInJsonObject.user_credentials_id,
    name: accountInJsonObject.name,
    surname: accountInJsonObject.surname,
    createdAt: accountInJsonObject.created_at,
    updatedAt: accountInJsonObject.updated_at
  };
};

const convertAccountFromObjectToJson = exports.convertAccountFromObjectToJson = (accountObject) => {
  // return account JSON
  return {
    "account_id": accountObject.account_id,
    "user_credentials_id": accountObject.user_credentials_id,
    "name": accountObject.name,
    "surname": accountObject.surname,
    "created_at": accountObject.created_at,
    "updated_at": accountObject.updated_at
  };
};

exports.convertCoordinatesFromJsonArrayToObjectArray = (arrayOfCoordinatesInJsonObjects) => {
  // return array of coordinates objects
  return arrayOfCoordinatesInJsonObjects.map((coordinatesInJsonObject) => {
    // return coordinates object(add it to array which will be returned)
    return convertCoordinatesFromJsonToObject(coordinatesInJsonObject);
  });
};

exports.convertCoordinatesFromObjectArrayToJsonArray = (arrayOfCoordinatesInObjects) => {
  // return array of coordinates JSON objects
  return arrayOfCoordinatesInObjects.map((coordinatesInObject) => {
    // return coordinates JSON object(add it to array which will be returned)
    return convertCoordinatesFromObjectToJson(coordinatesInObject);
  });
};

const convertCoordinatesFromJsonToObject = exports.convertCoordinatesFromJsonToObject = (coordinatesInJsonObject) => {
  // return coordinates object
  return {
    coordinatesId: coordinatesInJsonObject.id,
    accountId: coordinatesInJsonObject.account_id,
    latitude: coordinatesInJsonObject.latitude,
    longitude: coordinatesInJsonObject.longitude,
    createdAt: coordinatesInJsonObject.created_at
  };
};

const convertCoordinatesFromObjectToJson = exports.convertCoordinatesFromObjectToJson = (coordinatesInObject) => {
  // return coordinates JSON object
  return {
    "coordinates_id": coordinatesInObject.coordinates_id,
    "account_id": coordinatesInObject.account_id,
    "latitude": coordinatesInObject.latitude,
    "longitude": coordinatesInObject.longitude,
    "created_at": coordinatesInObject.created_at
  };
};
