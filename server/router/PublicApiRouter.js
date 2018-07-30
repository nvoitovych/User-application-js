const express = require("express");
const Joi = require("joi");
const BlueBird = require("bluebird");
const bcrypt = BlueBird.promisifyAll(require("bcrypt"));
const jwt = BlueBird.promisifyAll(require("jsonwebtoken"));
const config = require("../../config");
const db = require("../db/db");

const router = express.Router();

function addBcryptType (err) {
  // Compensate for `bcrypt` not using identifiable error types
  err.type = "bcryptError";
  throw err;
}

router.get("/hello", async (req, res) => {
  res.status(200).send({data: "It's alive!\nHello"});
});

router.post("/register", async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  const loginSchema = Joi.object().keys({login: Joi.string().alphanum().min(3).max(30).required()});

  const passwordSchema = Joi.object().keys({password: Joi.string().regex(/^[a-zA-Z0-9]{3,8}$/).required()});

  const loginValidationResult = Joi.validate({login: login}, loginSchema);
  const passwordValidationResult = Joi.validate({password: password}, passwordSchema);

  if (loginValidationResult.error) {
    if (passwordValidationResult.error) {
      res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid login and password"});
      return;
    } else {
      res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid login"});
      return;
    }
  } else {
    if (passwordValidationResult.error) {
      res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid password"});
      return;
    }
  }

  // Calculating a hash:
  const hashedPassword = await bcrypt.hashAsync(password, 10)
    .catch(error => {
      console.log("Error: ", error);
      switch (error.code) {
        default: {
          console.log("bcryptError");
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof hashedPassword === "undefined") {
    return;
  }

  const resultUserCredentials = await db.registerUser(login, hashedPassword)
    .catch(error => {
      switch (error.code) {
        case "ER_DUP_ENTRY": {
          res.status(409).send({code: 409, status: "CONFLICT", message: "User already exists"});
          break;
        }
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof resultUserCredentials === "undefined") {
    return;
  }

  const resultAccount = await db.createAccount(resultUserCredentials.userCredentialsId)
    .catch(error => {
      switch (error.code) {
        case "ER_DUP_ENTRY": {
          res.status(409).send({code: 409, status: "CONFLICT", message: "User already exists"});
          break;
        }
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof resultAccount === "undefined") {
    return;
  }

  const token = await jwt.signAsync({
    id: resultUserCredentials.userCredentialsId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // exp in 1 week
  }, config.secret)
    .catch(error => {
      switch (error.code) {
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof token !== "undefined") {
    res.status(200).send({token: token});
  }
});

router.post("/authorize", async (req, res) => {
  const id = req.body.id;
  const login = req.body.login;
  const password = req.body.password;

  const idSchema = Joi.object().keys({id: Joi.number().integer().min(0).max(999999999).required()});
  const loginSchema = Joi.object().keys({login: Joi.string().alphanum().min(3).max(30).required()});
  const passwordSchema = Joi.object().keys({password: Joi.string().regex(/^[a-zA-Z0-9]{3,8}$/).required()});

  const idValidationResult = Joi.validate({id: id}, idSchema);
  const loginValidationResult = Joi.validate({login: login}, loginSchema);
  const passwordValidationResult = Joi.validate({password: password}, passwordSchema);

  if (loginValidationResult.error || passwordValidationResult.error || idValidationResult.error) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid id, login or password"});
    return;
  }

  const userCredentials = await db.getUserCredentialsByUserCredentialsId(id)
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof userCredentials === "undefined") {
    return;
  }

  if (!userCredentials) {
    // There is no user credentials with this id
    res.status(401).send({code: 401, status: "UNAUTHORIZED", message: "There is no User with this id"});
  } else {
    // if user Credentials with that id exists
    // Validating a hash:
    // Load hash from your password DB.
    const isPasswordValid = await bcrypt.compareAsync(password, userCredentials.passwordHash).catch(addBcryptType)
      .catch(error => {
        console.log("Error: ", error);
        switch (error.code) {
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
            break;
          }
        }
      });

    if (typeof isPasswordValid === "undefined") {
      return;
    }

    if (isPasswordValid) {
      const token = await jwt.signAsync({
        id: userCredentials.userCredentialsId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // exp in 1 week
      }, config.secret)
        .catch(error => {
          switch (error.code) {
            default: {
              res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
              break;
            }
          }
        });
      if (typeof token !== "undefined") {
        res.status(200).send({token: token});
      }
    } else {
      // Wrong password
      res.status(401).send({code: 401, status: "UNAUTHORIZED", message: "Invalid password"});
    }
  }
});

module.exports = router;
