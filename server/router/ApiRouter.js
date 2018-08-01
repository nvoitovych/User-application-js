const express = require("express");
const BlueBird = require("bluebird");
const jwt = BlueBird.promisifyAll(require("jsonwebtoken"));
const config = require("../../config");
const db = require("../db/db");
const converter = require("../helpers/entityMapper");

const router = express.Router();

router.get("/user", async (req, res) => {
  const authorizationHeaderExists = req.headers["authorization"];

  if (!authorizationHeaderExists) {
    res.status(400).send({
      code: 400,
      status: "BAD_REQUEST",
      message: "Authorization header wasn't found or Auth Header is empty"
    });
    return;
  }

  const token = req.headers["authorization"].split(" ")[1]; // get token

  if (!token) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Token wasn't sent"});
  } else {
    const decode = await jwt
      .verifyAsync(token, config.secret)
      .catch(error => {
        switch (error.name) {
          case "TokenExpiredError": {
            res.status(401).send({code: 401, status: "UNAUTHORIZED", message: error.message});
            break;
          }
          case "JsonWebTokenError": {
            res.status(401).send({code: 401, status: "UNAUTHORIZED", message: error.message});
            break;
          }
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          }
        }
      });

    if (typeof decode === "undefined") {
      return;
    }

    const resultAccount = await db.getAccountByUserId(decode.userId)
      .catch(error => {
        switch (error.code) {
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          }
        }
      });

    if (typeof decode !== "undefined") {
      res.status(200).send({account: converter.accountObjToJson(resultAccount)});
    }
  }
});

router.get("/user/:userId/coordinates", async (req, res) => {
  const authorizationHeaderExists = req.headers["authorization"];
  const userId = parseInt(req.params["userId"]);

  if (!authorizationHeaderExists) {
    res.status(400).send({
      code: 400,
      status: "BAD_REQUEST",
      message: "Authorization header wasn't found or Auth Header is empty"
    });
    return;
  }

  const token = req.headers["authorization"].split(" ")[1]; // get token

  if (!token) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Token wasn't sent"});
  } else {
    const decode = await jwt
      .verifyAsync(token, config.secret)
      .catch(error => {
        switch (error.name) {
          case "TokenExpiredError": {
            res.status(401).send({code: 401, status: "UNAUTHORIZED", message: error.message});
            break;
          }
          case "JsonWebTokenError": {
            res.status(401).send({code: 401, status: "UNAUTHORIZED", message: error.message});
            break;
          }
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          }
        }
      });

    if (typeof decode === "undefined") {
      return;
    }

    let isAllowedToViewCoordinates = false;
    let isErrorOccurred = false;

    if (userId === decode.userId) {
      isAllowedToViewCoordinates = true;
    } else {
      // get relationship of user of requested coordinates and user of user who is logged(with jwt)
      // if return some relationship object - relationship exists --- should allow to view data
      const relationship = await db.getRelationshipBetweenUsers(userId, decode.userId)
        .catch(error => {
          switch (error.code) {
            default: {
              res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
              isErrorOccurred = true;
            }
          }
        });

      if (typeof relationship !== "undefined" && relationship) {
        isAllowedToViewCoordinates = true;
      }
    }

    // check is error occurred during getting relationships from db
    if (isErrorOccurred) {
      return;
    }

    if (!isAllowedToViewCoordinates) {
      res.status(403).send({code: 403, status: "FORBIDDEN", message: "Sorry, you are not allowed to view this information"});
      return;
    }

    const resultCoordinates = await db.getUserCoordinatesByUserId(userId)
      .catch(error => {
        switch (error.code) {
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          }
        }
      });

    if (typeof resultCoordinates === "undefined") {
      return;
    }

    if (typeof resultCoordinates !== "undefined") {
      res.status(200).send({coordinates: converter.coordinatesObjArrayToJsonArray(resultCoordinates)});
    }
  }
});

module.exports = router;
