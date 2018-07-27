module.exports = {
  secret: "secret for jwt",
  development: {
    connectionLimit: 50,
    host: "localhost",
    user: "app_user",
    password: "jeferson97",
    database: "app_db"
  },
  test: {
    connectionLimit: 50,
    host: "localhost",
    user: "app_user",
    password: "jeferson97",
    database: "app_test_db"
  },
  development_pool: {
    min: 1,
    max: 50
  },
  test_pool: {
    min: 1,
    max: 51
  }
};
