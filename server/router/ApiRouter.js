const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../db");

const router = express.Router();

router.get("/users", (req, res) => {
  const authorizationHeaderContent = req.headers["authorization"];
  const token = authorizationHeaderContent.split(" ")[1]; // get token

  if (!token) {
    return res.status(400).send({ message: "Token was't sent" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).send({message: "Wrong token"});
    };
  });
  db.getAllUsers()
    .then(resultUsers => {
      res.status(200).send(resultUsers);
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
        default: {
          res.status(500).send({code: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });
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
