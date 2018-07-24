const express = require("express");
const Joi = require("joi");
const BlueBird = require("bluebird");
const jwt = BlueBird.promisifyAll(require("jsonwebtoken"));
const config = require("../config");
const db = require("../db/db");

const router = express.Router();

router.get("/hello", (req, res) => {
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

  const resultUser = await db.registerUser(login, password)
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
  if (typeof resultUser !== "undefined") {
    res.status(200).send({id: resultUser.id, login: resultUser.login, password: resultUser.password});
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

  const user = await db.getUserById(id)
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (!user) {
    // There is no user with this id
    res.status(401).send({code: 401, status: "UNAUTHORIZED", message: "There is no User with this id"});
  } else {
    // if user with that id exists
    if (user.password === password) {
      const token = jwt.sign({
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // exp in 1 week
      }, config.secret);
      res.status(200).send({token: token});
    } else {
      // Wrong password
      res.status(401).send({code: 401, status: "UNAUTHORIZED", message: "Invalid password"});
    }
  }
});

module.exports = router;
