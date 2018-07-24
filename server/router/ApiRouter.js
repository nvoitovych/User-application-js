const express = require("express");
const BlueBird = require("bluebird");
const jwt = BlueBird.promisifyAll(require("jsonwebtoken"));
const config = require("../config");
const db = require("../db/db");

const router = express.Router();

router.get("/users", async (req, res) => {
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
    const resultUsers = await db.getAllUsers()
      .catch(error => {
        switch (error.code) {
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          }
        }
      });
    if (typeof decode !== "undefined") {
      res.status(200).send(resultUsers);
    }
  }
});

// router.get("/users/:id/delete", (req, res) => {
//   const authorizationHeaderContent = req.headers['authorization'];
//   const token = authorizationHeaderContent.split(' ')[1]; // get token
//
//   if (!token) {
//     res.status(401).send({ message: "Token was't sent" });
//     return;
//   }
//
//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return res.status(500, description='Internal Server Error').send({
//         message: 'Failed to authenticate token.'
//       });
//     };
//     if (decoded.id == req.params.id) {
//       return res.status(405, description='Method Not Allowed').send({
//         message: "Can't delete own account!"
//       });
//     }
//   });
//
//   const connection = dbConnection();
//
//   connection.queryAsync(`SELECT * FROM users;`)
//     .then((rows, fields) => {
//       res.status(200).send({ users: rows });
//     })
//     .catch((err) => {
//         res.status(500).send({ message: err.error });
//     });
// });

module.exports = router;
