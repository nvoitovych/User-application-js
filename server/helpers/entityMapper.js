exports.UsersJsonArrayToObjArray = (usersJsonArray) => {
  // return array of user credentials objects
  return usersJsonArray.map((userJson) => {
    // return user credentials object(add it to array which will be returned)
    return userJsonToObj(userJson);
  });
};

exports.usersObjArrayToJsonArray = (usersObjArray) => {
  // return array of user credentials JSON objects
  return usersObjArray.map((userObj) => {
    // return user credentials JSON object(add it to array which will be returned)
    return userObjToJson(userObj);
  });
};

const userJsonToObj = exports.userJsonToObj = (userJson) => {
  if (typeof userJson !== "undefined") {
    // return user credentials object
    return {
      userId: userJson.user_id,
      login: userJson.login,
      passwordHash: userJson.password_hash
    };
  }
};

const userObjToJson = exports.userObjToJson = (userObj) => {
  if (typeof userObj !== "undefined") {
    // return user credentials JSON object
    return {
      "userId": userObj.userId,
      "login": userObj.login,
      "passwordHash": userObj.passwordHash
    };
  }
};

exports.accountsJsonArrayToObjArray = (accountsJsonArray) => {
  // return array of accounts objects
  return accountsJsonArray.map((accountJson) => {
    // return account object(add it to array which will be returned)
    return accountJsonToObj(accountJson);
  });
};

exports.accountsObjArrayToJsonArray = (accountsObjArray) => {
  // return array of accounts JSON objects
  return accountsObjArray.map((accountObj) => {
    // return account JSON object(add it to array which will be returned)
    return accountObjToJson(accountObj);
  });
};

const accountJsonToObj = exports.accountJsonToObj = (accountJson) => {
  if (typeof accountJson !== "undefined") {
    // return account object
    return {
      accountId: accountJson.account_id,
      userId: accountJson.user_id,
      name: accountJson.name,
      surname: accountJson.surname,
      createdAt: accountJson.created_at,
      updatedAt: accountJson.updated_at
    };
  }
};

const accountObjToJson = exports.accountObjToJson = (accountObj) => {
  if (typeof accountObj !== "undefined") {
    // return account JSON
    return {
      "accountId": accountObj.accountId,
      "userId": accountObj.userId,
      "name": accountObj.name,
      "surname": accountObj.surname,
      "createdAt": accountObj.createdAt,
      "updatedAt": accountObj.updatedAt
    };
  }
};

exports.coordinatesJsonArrayToObjArray = (coordinatesJsonArray) => {
  // return array of coordinates objects
  return coordinatesJsonArray.map((coordinatesJson) => {
    // return coordinates object(add it to array which will be returned)
    return coordinatesJsonToObj(coordinatesJson);
  });
};

exports.coordinatesObjArrayToJsonArray = (coordinatesObjArray) => {
  // return array of coordinates JSON objects
  return coordinatesObjArray.map((coordinatesObj) => {
    // return coordinates JSON object(add it to array which will be returned)
    return coordinatesObjToJson(coordinatesObj);
  });
};

const coordinatesJsonToObj = exports.coordinatesJsonToObj = (coordinatesJson) => {
  if (typeof coordinatesJson !== "undefined") {
    // return coordinates object
    return {
      coordinatesId: coordinatesJson.coordinates_id,
      userId: coordinatesJson.user_id,
      latitude: coordinatesJson.latitude,
      longitude: coordinatesJson.longitude,
      createdAt: coordinatesJson.created_at
    };
  }
};

const coordinatesObjToJson = exports.coordinatesObjToJson = (coordinatesObj) => {
  if (typeof coordinatesObj !== "undefined") {
    // return coordinates JSON object
    return {
      "coordinatesId": coordinatesObj.coordinatesId,
      "userId": coordinatesObj.userId,
      "latitude": coordinatesObj.latitude,
      "longitude": coordinatesObj.longitude,
      "createdAt": coordinatesObj.createdAt
    };
  }
};

const relationshipJsonToObj = exports.relationshipJsonToObj = (relationshipJson) => {
  if (typeof relationshipJson !== "undefined") {
    return {
      relationshipId: relationshipJson.relationship_id,
      accountIdWhoShareData: relationshipJson.account_id_who_share_data,
      accountIdWhoReceiveData: relationshipJson.account_id_who_receive_data
    };
  }
};

const relationshipObjToJson = exports.relationshipObjToJson = (relationshipObj) => {
  if (typeof relationshipObj !== "undefined") {
    return {
      relationship_id: relationshipObj.relationshipId,
      account_id_who_share_data: relationshipObj.accountIdWhoShareData,
      account_id_who_receive_data: relationshipObj.accountIdWhoReceiveData
    };
  }
};

exports.relationshipsJsonArrayToObjArray = (relationshipJsonArray) => {
  // return array of Relationship objects
  return relationshipJsonArray.map((relationshipJson) => {
    // return Relationship object(add it to array which will be returned)
    return relationshipJsonToObj(relationshipJson);
  });
};

exports.relationshipsObjArrayToJsonArray = (relationshipObjArray) => {
  // return array of Relationship JSON objects
  return relationshipObjArray.map((relationshipObj) => {
    // return Relationship JSON object(add it to array which will be returned)
    return relationshipObjToJson(relationshipObj);
  });
};
