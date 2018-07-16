const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const Joi = require("joi");
const db = require("../db");

const router = express.Router();

router.get("/hello", (req, res) => {
  res.status(200).send({data: "It's alive!\nHello"});
});

router.post("/register", (req, res) => {
  const loginSchema = Joi.object().keys({
    login: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,8}$/).allow("").required()
  }).with("login", "password");

  const login = req.body.login;
  const password = req.body.password;

  const result = Joi.validate({login: login, password: password}, schema);

  if (result.error) {
    res.status(400).send({code: "BAD_REQUEST", message: "Bad Request"});
    return;
  }
  db.registerUser(login, password)
    .then(resultUser => {
      res.status(200).send({id: resultUser.id, login: resultUser.login, password: resultUser.password});
    })
    .catch(error => {
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR": {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
        case "ER_DBACCESS_DENIED_ERROR": {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
        case "ER_NOT_SUPPORTED_AUTH_MODE": {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
        case "ER_DUP_ENTRY": {
          res.status(409).send({code: "CONFLICT", message: "Conflict"});
          break;
        }
        default: {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });
});

router.post("/authorize", (req, res) => {
  const id = req.body.id;
  const login = req.body.login;
  const password = req.body.password;
  const schema = Joi.object().keys({
    id: Joi.number().integer().min(0).max(999999999).required(),
    login: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,8}$/).allow("").required()
  });

  const result = Joi.validate({id: id, login: login, password: password}, schema);

  if (result.error) {
    res.status(400).send({code: "BAD_REQUEST", message: "Bad Request"});
    return;
  }
  db.getUserById(id)
    .then((user) => {
      if (!user) {
        // There is no user with this login
        res.status(401).send({code: "UNAUTHORIZED", message: "Unauthorized"});
      } else {
        // user with that id exists
        if (user.password === password) {
          const token = jwt.sign({
            id: user.id,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // exp in 1 week
          }, config.secret);
          res.status(200).send({token: token});
        } else {
          // Wrong password
          res.status(401).send({code: "UNAUTHORIZED", message: "Unauthorized"});
        }
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR": {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
        case "ER_DBACCESS_DENIED_ERROR": {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
        case "ER_NOT_SUPPORTED_AUTH_MODE": {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
        default: {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });
});

module.exports = router;
