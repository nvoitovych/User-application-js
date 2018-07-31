exports.convertUsersCredentialsFromJsonArrayToObjectArray = (arrayOfUsersCredentialsInJsonObjects) => {
  // return array of user credentials objects
  return arrayOfUsersCredentialsInJsonObjects.map((userCredentialsInJsonObject) => {
    // return user credentials object(add it to array which will be returned)
    return convertUserFromJsonToObject(userCredentialsInJsonObject);
  });
};

exports.convertUsersCredentialsFromObjectArrayToJsonArray = (arrayOfUsersCredentialsInObjects) => {
  // return array of user credentials JSON objects
  return arrayOfUsersCredentialsInObjects.map((userCredentialsInObject) => {
    // return user credentials JSON object(add it to array which will be returned)
    return convertUserCredentialsFromObjectToJson(userCredentialsInObject);
  });
};

const convertUserFromJsonToObject = exports.convertUserFromJsonToObject = (userCredentialsInJson) => {
  if (typeof userCredentialsInJson !== "undefined") {
    // return user credentials object
    return {
      userId: userCredentialsInJson.user_id,
      login: userCredentialsInJson.login,
      passwordHash: userCredentialsInJson.password_hash
    };
  }
};

const convertUserCredentialsFromObjectToJson = exports.convertUserCredentialsFromObjectToJson = (userCredentialsInObject) => {
  if (typeof userCredentialsInObject !== "undefined") {
    // return user credentials JSON object
    return {
      "userId": userCredentialsInObject.userId,
      "login": userCredentialsInObject.login,
      "passwordHash": userCredentialsInObject.passwordHash
    };
  }
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
  if (typeof accountInJsonObject !== "undefined") {
    // return account object
    return {
      accountId: accountInJsonObject.account_id,
      userId: accountInJsonObject.user_id,
      name: accountInJsonObject.name,
      surname: accountInJsonObject.surname,
      createdAt: accountInJsonObject.created_at,
      updatedAt: accountInJsonObject.updated_at
    };
  }
};

const convertAccountFromObjectToJson = exports.convertAccountFromObjectToJson = (accountObject) => {
  if (typeof accountObject !== "undefined") {
    // return account JSON
    return {
      "accountId": accountObject.accountId,
      "userId": accountObject.userId,
      "name": accountObject.name,
      "surname": accountObject.surname,
      "createdAt": accountObject.createdAt,
      "updatedAt": accountObject.updatedAt
    };
  }
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

const convertCoordinatesFromJsonToObject = exports.convertCoordinatesFromJsonToObject = (coordinatesInJson) => {
  if (typeof coordinatesInJson !== "undefined") {
    // return coordinates object
    console.log("CoordL: ", coordinatesInJson);
    return {
      coordinatesId: coordinatesInJson.coordinates_id,
      userId: coordinatesInJson.user_id,
      latitude: coordinatesInJson.latitude,
      longitude: coordinatesInJson.longitude,
      createdAt: coordinatesInJson.created_at
    };
  }
};

const convertCoordinatesFromObjectToJson = exports.convertCoordinatesFromObjectToJson = (coordinatesInObject) => {
  if (typeof coordinatesInObject !== "undefined") {
    // return coordinates JSON object
    return {
      "coordinatesId": coordinatesInObject.coordinatesId,
      "userId": coordinatesInObject.userId,
      "latitude": coordinatesInObject.latitude,
      "longitude": coordinatesInObject.longitude,
      "createdAt": coordinatesInObject.createdAt
    };
  }
};

const convertRelationshipFromJsonToObject = exports.convertRelationshipFromJsonToObject = (relationshipInJson) => {
  if (typeof relationshipInJson !== "undefined") {
    return {
      relationshipId: relationshipInJson.relationship_id,
      accountIdWhoShareData: relationshipInJson.account_id_who_share_data,
      accountIdWhoReceiveData: relationshipInJson.account_id_who_receive_data
    };
  }
};

const convertRelationshipFromObjectToJson = exports.convertRelationshipFromObjectToJson = (relationshipInObject) => {
  if (typeof relationshipInObject !== "undefined") {
    return {
      relationship_id: relationshipInObject.relationshipId,
      account_id_who_share_data: relationshipInObject.accountIdWhoShareData,
      account_id_who_receive_data: relationshipInObject.accountIdWhoReceiveData
    };
  }
};

exports.convertRelationshipsFromJsonArrayToObjectArray = (arrayOfRelationshipInJsonObjects) => {
  // return array of Relationship objects
  return arrayOfRelationshipInJsonObjects.map((relationshipInJsonObject) => {
    // return Relationship object(add it to array which will be returned)
    return convertRelationshipFromJsonToObject(relationshipInJsonObject);
  });
};

exports.convertRelationshipsFromObjectArrayToJsonArray = (arrayOfRelationshipInObjects) => {
  // return array of Relationship JSON objects
  return arrayOfRelationshipInObjects.map((relationshipInObject) => {
    // return Relationship JSON object(add it to array which will be returned)
    return convertRelationshipFromObjectToJson(relationshipInObject);
  });
};
