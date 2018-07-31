/* eslint-disable handle-callback-err,no-useless-escape,no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const BlueBird = require("bluebird");
const jwt = BlueBird.promisifyAll(require("jsonwebtoken"));
const config = require("../config");
const bcrypt = require("bcrypt");
const converter = require("../server/helpers/mapper");

const env = process.env.NODE_ENV || "development";

const knexConfig = require("../knexfile")[env];
const knex = require("knex")(knexConfig);

const urlBase = "http://localhost:8080/";

chai.use(chaiHttp);

const cleanDB = () => {
  return new Promise((resolve, reject) => {
    const relationship = knex("relationship")
      .del()
      .catch((err) => {
        console.log("\nError del relationship: ", err.message);
      });

    if (typeof relationship === "undefined") {
      return;
    }

    const coordinates = knex("coordinates")
      .del()
      .catch((err) => {
        console.log("\nError del coordinates: ", err.message);
      });

    if (typeof coordinates === "undefined") {
      return;
    }

    const account = knex("account")
      .del()
      .catch((err) => {
        console.log("\nError del account: ", err.message);
      });

    if (typeof account === "undefined") {
      return;
    }

    const userCredentials = knex("user_credentials")
      .del()
      .catch((err) => {
        console.log("\nError del user_credentials: ", err.message);
      });

    resolve(userCredentials);
  });
};

describe("Testing Public API", () => {
  const urlPublicApiBase = urlBase + "publicapi/";

  describe("GET hello/", () => {
    const path = "hello";

    it("returns status 200", (done) => {
      chai
        .request(urlPublicApiBase)
        .get(path)
        .end((error, response) => {
          chai.expect(response.statusCode).to.equal(200);
          done();
        });
    });

    it("returns JSON data", (done) => {
      chai
        .request(urlPublicApiBase)
        .get(path)
        .end((error, response) => {
          chai.expect(response.body.data).to.equal("It\'s alive!\nHello");
          done();
        });
    });
  });

  describe("POST register/", () => {
    const path = "register";

    beforeEach((done) => {
      cleanDB()
        .then(error => {
          done();
        });
    });

    it("returns the status code 200 on user adding success", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin10", password: "admin10"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid password(Minimum long required - 3 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin10", password: "adm"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid login(Minimum long required - 3 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "adm", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid login and password (Both minimum long required - 3 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "adm", password: "adm"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid password(Maximum long required - 8 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin10", password: "admin123"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid login(Maximum long required - 30 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1234567890123456789012345", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid login and password (Both maximum long required - 30 char login & 8 char pass)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1234567890123456789012345", password: "admin123"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid password(Minimum long required - 3 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin10", password: "adm"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid login(Minimum long required - 3 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "adm", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with valid login and password (Both minimum long required - 3 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "adm", password: "adm"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with password and login in another order", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({password: "admin10", login: "admin10"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success with more params then needed", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin10", password: "admin10", data: "More data"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure without password", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with invalid password(Too short - 2 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1", password: "ad"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid password");
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with invalid login(Too short - 2 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "ad", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid login");
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with invalid login and password (Too short - 2 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "ad", password: "ad"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with invalid password(Too long - 9 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1", password: "admin1234"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid password");
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with invalid login(Too long - 31 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin12345678901234567890123456", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid login");
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with invalid login and password (Too long - 31 char login and 9 char pass)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin12345678901234567890123456", password: "admin1234"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid login and password");
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure without login", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with empty login", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with empty password", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1", password: ""})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            done();
          }
        });
    });

    it("returns the status code 400 on user adding failure with invalid password and login(Both are empty)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "", password: ""})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            done();
          }
        });
    });

    it("returns the status code 409 on duplicated user adding", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin10", password: "admin10"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);

            chai.request(urlPublicApiBase)
              .post(path)
              .set("content-type", "application/json")
              .send({login: "admin10", password: "admin10"})
              .end((error, response, body) => {
                if (error) {
                  return done(error);
                } else {
                  chai.expect(response.statusCode).to.equal(409);
                  done();
                }
              });
          }
        });
    });

    it("returns the status code CONFLICT on duplicated user adding", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin10", password: "admin10"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);

            chai.request(urlPublicApiBase)
              .post(path)
              .set("content-type", "application/json")
              .send({login: "admin10", password: "admin10"})
              .end((error, response, body) => {
                if (error) {
                  return done(error);
                } else {
                  chai.expect(response.body.code).to.equal(409);
                  chai.expect(response.body.status).to.equal("CONFLICT");
                  chai.expect(response.body.message).to.equal("User already exists");
                  done();
                }
              });
          }
        });
    });
  });

  describe("POST authorize/", () => {
    const path = "authorize";

    before(done => {
      cleanDB()
        .then(err => {
          chai
            .request(urlPublicApiBase)
            .post("register")
            .set("content-type", "application/json")
            .send({login: "admin1", password: "admin1"})
            .end((error, res, body) => {
              done();
            });
        })
        .catch(err => {
          console.log("Error: ", err);
        });
    });

    it("returns the token  when login and password are valid", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 401 on user authorization with wrong password", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1", password: "adm"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(401);
            chai.expect(response.body.code).to.equal(401);
            chai.expect(response.body.status).to.equal("UNAUTHORIZED");
            chai.expect(response.body.message).to.equal("Wrong password");
            done();
          }
        });
    });

    it("returns the status code 401 on user authorization with wrong login", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "adm", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(401);
            chai.expect(response.body.code).to.equal(401);
            chai.expect(response.body.status).to.equal("UNAUTHORIZED");
            chai.expect(response.body.message).to.equal("There is no User with this login");
            done();
          }
        });
    });

    it("returns the status code 400 on user authorization with invalid login(Too short - 2 chars)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "ad", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid login or password");
            done();
          }
        });
    });

    it("returns the status code 400 on user authorization with invalid password(Too short - 2 chars)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1", password: "ad"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid login or password");
            done();
          }
        });
    });

    it("returns the status code 400 on user authorization with invalid password(Too long - 10 chars)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/json")
        .send({login: "admin1", password: "admin12345"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid login or password");
            done();
          }
        });
    });
  });
});

describe("Testing API", () => {
  let validTokenOfAdmin;
  let validTokenOfAdmin1;
  let validTokenOfAdmin2;
  let validTokenOfAdmin3;
  let validTokenOfAdmin4;
  let validTokenOfAdmin5;

  describe("GET /user", () => {
    const path = "user";

    before(done => {
      cleanDB()
        .then(err => {
          chai
            .request(urlBase + "publicapi/")
            .post("register")
            .set("content-type", "application/json")
            .send({login: "admin1", password: "admin1"})
            .end((err, responseRegister, bodyRegister) => {
              if (!err) {
                chai
                  .request(urlBase + "publicapi/")
                  .post("authorize")
                  .set("content-type", "application/json")
                  .send({login: "admin1", password: "admin1"})
                  .end((error, responseAuthorize, bodyAuthorize) => {
                    validTokenOfAdmin = responseAuthorize.body.token;
                    done();
                  });
              }
            });
        })
        .catch(err => {
          console.log("Error: ", err);
        });
    });

    it("returns status 200 and json with just created account of current(owner of JWT) user object", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path)
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + validTokenOfAdmin)
        .end((error, responseUser, bodyUser) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUser.statusCode).to.equal(200);
            chai.expect(responseUser.body).to.to.have.property("account");
            chai.expect(responseUser.body.account).to.to.have.property("userId");
            chai.expect(responseUser.body.account).to.to.have.property("accountId");
            chai.expect(responseUser.body.account).to.to.have.property("name");
            chai.expect(responseUser.body.account).to.to.have.property("surname");
            chai.expect(responseUser.body.account).to.to.have.property("createdAt");
            chai.expect(responseUser.body.account).to.to.have.property("updatedAt");
            done();
          }
        });
    });

    it("returns status 400 on request without token", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path)
        .set("content-type", "application/json")
        .set("authorization", "Bearer  ")
        .end((error, responseUsers, bodyUsers) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUsers.statusCode).to.equal(400);
            chai.expect(responseUsers.body.message).to.equal("Token wasn't sent");
            done();
          }
        });
    });

    it("returns status 400 on request with wrong(empty) token", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path)
        .set("content-type", "application/json")
        .set("authorization", "Bearer ")
        .end((error, responseUsers, bodyUsers) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUsers.statusCode).to.equal(400);
            chai.expect(responseUsers.body.message).to.equal("Token wasn't sent");
            done();
          }
        });
    });

    it("returns status 400 on request with wrong(empty) Authorization header", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path)
        .set("content-type", "application/json")
        .set("authorization", "")
        .end((error, responseUsers, bodyUsers) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUsers.statusCode).to.equal(400);
            chai.expect(responseUsers.body.message).to.equal("Authorization header wasn't found or Auth Header is empty");
            done();
          }
        });
    });

    it("returns status 401 on request with wrong(Malformed) JWT", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path)
        .set("content-type", "application/json")
        .set("authorization", "Bearer wrong-token")
        .end((error, responseUsers, bodyUsers) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUsers.statusCode).to.equal(401);
            chai.expect(responseUsers.body.message).to.equal("jwt malformed");
            done();
          }
        });
    });

    // should return datetime of expiration in this situation?
    it("returns status 401 on request with wrong(Expired) JWT", (done) => {
      const expiredToken = jwt.sign({
        userId: 1,
        exp: Math.floor(Date.now() / 1000) - 10000// expired 10s before
      }, config.secret);
      chai
        .request(urlBase + "api/")
        .get(path)
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + expiredToken)
        .end((error, responseUsers, bodyUsers) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUsers.statusCode).to.equal(401);
            chai.expect(responseUsers.body.message).to.equal("jwt expired");
            done();
          }
        });
    });

    it("returns status 400 on request with valid JWT without 'Bearer' signed in header", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path)
        .set("content-type", "application/json")
        .set("authorization", validTokenOfAdmin)
        .end((error, responseUsers, bodyUsers) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUsers.statusCode).to.equal(400);
            chai.expect(responseUsers.body.message).to.equal("Token wasn't sent");
            done();
          }
        });
    });

    it("returns status 400 on request without Authorization header", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path)
        .set("content-type", "application/json")
        .end((error, responseUsers, bodyUsers) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUsers.statusCode).to.equal(400);
            chai.expect(responseUsers.body.message).to.equal("Authorization header wasn't found or Auth Header is empty");
            done();
          }
        });
    });
  });

  describe("GET /user/:userId/coordinates", () => {
    const path = "user/";
    before((done) => {
      let passwords = [];

      cleanDB()
        .then(async () => {
          const pass1 = await bcrypt.hash("admin1", 10);
          passwords.push(pass1);
        })
        .then(async () => {
          const pass2 = await bcrypt.hash("admin2", 10);
          passwords.push(pass2);
        })
        .then(async () => {
          const pass3 = await bcrypt.hash("admin3", 10);
          passwords.push(pass3);
        })
        .then(async () => {
          const pass4 = await bcrypt.hash("admin4", 10);
          passwords.push(pass4);
        })
        .then(async () => {
          const pass5 = await bcrypt.hash("admin5", 10);
          passwords.push(pass5);
        })
        .then(async () => {
          await knex("user_credentials")
            .insert([
              {user_id: 1, login: "admin1", password_hash: passwords[0]},
              {user_id: 2, login: "admin2", password_hash: passwords[1]},
              {user_id: 3, login: "admin3", password_hash: passwords[2]},
              {user_id: 4, login: "admin4", password_hash: passwords[3]},
              {user_id: 5, login: "admin5", password_hash: passwords[4]}
            ]);
        })
        .then(async () => {
          await knex("account").insert([
            {account_id: 1, user_id: 1, created_at: new Date()},
            {account_id: 2, user_id: 2, created_at: new Date()},
            {account_id: 3, user_id: 3, created_at: new Date()},
            {account_id: 4, user_id: 4, created_at: new Date()},
            {account_id: 5, user_id: 5, created_at: new Date()}
          ]);
        })
        .then(async () => {
          await knex("relationship").insert([
            {relationship_id: 1, user_id_who_share_data: 1, user_id_who_receive_data: 2},
            {relationship_id: 2, user_id_who_share_data: 2, user_id_who_receive_data: 1},
            {relationship_id: 3, user_id_who_share_data: 3, user_id_who_receive_data: 1},
            {relationship_id: 4, user_id_who_share_data: 4, user_id_who_receive_data: 1}
          ]);
        })
        .then(async () => {
          await knex("coordinates").insert([
            {coordinates_id: 1, user_id: 1, latitude: 1, longitude: 1, created_at: new Date()},
            {coordinates_id: 2, user_id: 2, latitude: 2, longitude: 2, created_at: new Date()},
            {coordinates_id: 3, user_id: 3, latitude: 3, longitude: 3, created_at: new Date()},
            {coordinates_id: 4, user_id: 4, latitude: 4, longitude: 4, created_at: new Date()},
          ]);
        })
        .then(async () => {
          const responseAuthorize = await chai
            .request(urlBase + "publicapi/")
            .post("authorize")
            .set("content-type", "application/json")
            .send({login: "admin1", password: "admin1"});

          validTokenOfAdmin1 = responseAuthorize.body.token;
        })
        .then(async () => {
          const responseAuthorize = await chai
            .request(urlBase + "publicapi/")
            .post("authorize")
            .set("content-type", "application/json")
            .send({login: "admin2", password: "admin2"});

          validTokenOfAdmin2 = responseAuthorize.body.token;
        })
        .then(async () => {
          const responseAuthorize = await chai
            .request(urlBase + "publicapi/")
            .post("authorize")
            .set("content-type", "application/json")
            .send({login: "admin5", password: "admin5"})

          validTokenOfAdmin5 = responseAuthorize.body.token;
          done();
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });

    it("returns status 200 and json with array of coordinates for owner", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path + "1/coordinates")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + validTokenOfAdmin1)
        .end((error, responseUser, bodyUser) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUser.statusCode).to.equal(200);
            chai.expect(responseUser.body).to.to.have.property("coordinates");
            chai.expect(responseUser.body.coordinates[0].coordinatesId).to.equal(1);
            chai.expect(responseUser.body.coordinates[0].userId).to.equal(1);
            chai.expect(responseUser.body.coordinates[0].latitude).to.equal(1);
            chai.expect(responseUser.body.coordinates[0].longitude).to.equal(1);
            chai.expect(responseUser.body.coordinates[0]).to.to.have.property("createdAt");
            done();
          }
        });
    });

    it("returns status 200 and json with array of coordinates for allowed User(Both side relationship 1-2, 2-1)", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path + "2/coordinates")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + validTokenOfAdmin1)
        .end((error, responseUser, bodyUser) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUser.statusCode).to.equal(200);
            chai.expect(responseUser.body).to.to.have.property("coordinates");
            chai.expect(responseUser.body.coordinates[0].coordinatesId).to.equal(2);
            chai.expect(responseUser.body.coordinates[0].userId).to.equal(2);
            chai.expect(responseUser.body.coordinates[0].latitude).to.equal(2);
            chai.expect(responseUser.body.coordinates[0].longitude).to.equal(2);
            chai.expect(responseUser.body.coordinates[0]).to.to.have.property("createdAt");
            done();
          }
        });
    });

    it("returns status 200 and json with array of coordinates for allowed User(One side: 3-1)", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path + "3/coordinates")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + validTokenOfAdmin1)
        .end((error, responseUser, bodyUser) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUser.statusCode).to.equal(200);
            chai.expect(responseUser.body).to.to.have.property("coordinates");
            chai.expect(responseUser.body.coordinates[0].coordinatesId).to.equal(3);
            chai.expect(responseUser.body.coordinates[0].userId).to.equal(3);
            chai.expect(responseUser.body.coordinates[0].latitude).to.equal(3);
            chai.expect(responseUser.body.coordinates[0].longitude).to.equal(3);
            chai.expect(responseUser.body.coordinates[0]).to.to.have.property("createdAt");
            done();
          }
        });
    });

    it("returns status 200 and json with array of coordinates for owner without any coordinates", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path + "5/coordinates")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + validTokenOfAdmin5)
        .end((error, responseUser, bodyUser) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUser.statusCode).to.equal(200);
            chai.expect(responseUser.body).to.to.have.property("coordinates");
            chai.expect(responseUser.body.coordinates).to.deep.equal([]);
            done();
          }
        });
    });

    it("returns status 403 NOT allowed User", (done) => {
      chai
        .request(urlBase + "api/")
        .get(path + "3/coordinates")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + validTokenOfAdmin2)
        .end((error, responseUser, bodyUser) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUser.statusCode).to.equal(403);
            chai.expect(responseUser.body.status).to.equal("FORBIDDEN");
            chai.expect(responseUser.body.message).to.equal("Sorry, you are not allowed to view this information");
            done();
          }
        });
    });
  });
});
