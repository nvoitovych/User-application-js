const BlueBird = require("bluebird");
const mysql = require("mysql");

BlueBird.promisifyAll(require("mysql/lib/Pool").prototype);

const pool = mysql.createPool({
  connectionLimit: 50,
  host: "localhost",
  user: "app-user",
  password: "jeferson97",
  database: "app_test_db"
});

exports.registerUser = (login, password) => {
  const sqlAddUser = "INSERT INTO users (`login`, `password`) VALUES (?, ?);";
  return pool.queryAsync(sqlAddUser, [login, password])
    .then(result => {
      return getUserById(result.insertId);
    });
};

const getUserById = exports.getUserById = (id) => {
  const sqlGetUserById = `SELECT * FROM users WHERE id = ? LIMIT 1;`;
  return pool.queryAsync(sqlGetUserById, [id])
    .then(resultUsers => {
      return resultUsers[0];
    });
};

exports.getAllUsers = () => {
  const sqlGetAllUsers = `SELECT * FROM users;`;
  return pool.queryAsync(sqlGetAllUsers)
    .then(resultUsers => {
      return resultUsers;
    });
};

exports.deleteAllUsers = () => {
  const sqlDeleteAllUsers = `DELETE FROM users;`;
  return pool.queryAsync(sqlDeleteAllUsers)
    .then(result => {
      return result;
    });
};
