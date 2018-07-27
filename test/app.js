/* eslint-disable handle-callback-err,no-useless-escape,no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const BlueBird = require("bluebird");
const jwt = BlueBird.promisifyAll(require("jsonwebtoken"));
const db = require("../server/db/db");
const config = require("../config");

const urlBase = "http://localhost:8080/";

chai.use(chaiHttp);

describe("Testing DB Connection", () => {
  // it("returns status 500 on adding new user to DB with wrong DB name", (done) => {
  //   chai
  //     .request(urlPublicApiBase)
  //     .post(path)
  //     .set("content-type", "application/x-www-form-urlencoded")
  //     .send({login: "admin1", password: "admin1"})
  //     .end((error, response, body) => {
  //       if (error) {
  //         return done(error);
  //       } else {
  //         chai.expect(response.statusCode).to.equal(500);
  //         done();
  //       }
  //     });
  // });
});

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
      db.truncateTableUsers()
        .then(error => {
          done();
        });
    });

    it("returns the created resource on success", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
        .send({login: "admin1", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.body.login).to.equal("admin1");
            chai.expect(response.body.password).to.equal("admin1");
            done();
          }
        });
    });

    it("returns the status code 200 on user adding success", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
        .send({login: "admin1", password: "admin1"})
        .end((error, response, body) => {
          console.log("Error: ", error);
          console.log("Response body: ", response.body);
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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

    it("returns the status code 200 on user adding success with valid password(Minimum long required - 3 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
        .send({login: "admin1", password: "adm"})
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
        .send({login: "admin1", password: "admin123"})
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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

    it("returns the status code 400 on user adding failure with invalid password(Too long - 9 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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

    it("returns the status code 200 on user adding success with valid password(Minimum long required - 3 characters)", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
        .send({login: "admin1", password: "adm"})
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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

    it("returns the status code 400 on user adding failure without login", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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
        .set("content-type", "application/x-www-form-urlencoded")
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

    it("returns the status code 200 on user adding success with password and login in another order", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
        .send({password: "admin1", login: "admin1"})
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
        .set("content-type", "application/x-www-form-urlencoded")
        .send({login: "admin1", password: "admin1", data: "More data"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns the status code 409 on duplicated user adding", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
        .send({login: "admin1", password: "admin1"})
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(200);
            chai
              .request(urlPublicApiBase)
              .post(path)
              .set("content-type", "application/x-www-form-urlencoded")
              .send({login: "admin1", password: "admin1"})
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
        .set("content-type", "application/x-www-form-urlencoded")
        .send({login: "admin1", password: "admin1"})
        .end((error, res, body) => {
          if (!error) {
            chai.expect(res.statusCode).to.equal(200);
            chai
              .request(urlPublicApiBase)
              .post(path)
              .set("content-type", "application/x-www-form-urlencoded")
              .send({login: "admin1", password: "admin1"})
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
          } else {
            return done(error);
          }
        });
    });
  });

  describe("POST authorize/", () => {
    const path = "authorize";

    before(done => {
      db.truncateTableUsers()
        .then(err => {
          chai
            .request(urlPublicApiBase)
            .post("register")
            .set("content-type", "application/x-www-form-urlencoded")
            .send({ login: "admin1", password: "admin1" })
            .end((error, res, body) => {
              done();
            });
        })
        .catch(err => {
          console.log("Error: ", err);
        });
    });

    it("returns the token  when user id, login and password are valid", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
        .send({ id: "1", login: "admin1", password: "admin1" })
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
        .set("content-type", "application/x-www-form-urlencoded")
        .send({ id: "1", login: "admin1", password: "adm" })
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(401);
            chai.expect(response.body.code).to.equal(401);
            chai.expect(response.body.status).to.equal("UNAUTHORIZED");
            chai.expect(response.body.message).to.equal("Invalid password");
            done();
          }
        });
    });

    it("returns the status code 400 on user authorization with invalid(Too long - 10 chars) password", (done) => {
      chai
        .request(urlPublicApiBase)
        .post(path)
        .set("content-type", "application/x-www-form-urlencoded")
        .send({ id: "1", login: "admin1", password: "admin12345" })
        .end((error, response, body) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.body.code).to.equal(400);
            chai.expect(response.body.status).to.equal("BAD_REQUEST");
            chai.expect(response.body.message).to.equal("Invalid id, login or password");
            done();
          }
        });
    });
  });
});

describe("Testing API", () => {
  let validToken;

  describe("GET /users", () => {
    before(done => {
      db.truncateTableUsers()
        .then(err => {
          chai
            .request(urlBase + "publicapi/")
            .post("register")
            .set("content-type", "application/x-www-form-urlencoded")
            .send({login: "admin1", password: "admin1"})
            .end((err, responseRegister, bodyRegister) => {
              if (!err) {
                chai
                  .request(urlBase + "publicapi/")
                  .post("authorize")
                  .set("content-type", "application/x-www-form-urlencoded")
                  .send({id: "1", login: "admin1", password: "admin1"})
                  .end((error, responseAuthorize, bodyAuthorize) => {
                    validToken = responseAuthorize.body.token;
                    done();
                  });
              }
            });
        })
        .catch(err => {
          console.log("Error: ", err);
        });
    });

    it("returns status 200 and json list with just created user object", (done) => {
      chai
        .request(urlBase + "api/")
        .get("users")
        .set("content-type", "application/x-www-form-urlencoded")
        .set("authorization", "Bearer " + validToken)
        .end((error, responseUsers, bodyUsers) => {
          if (error) {
            return done(error);
          } else {
            chai.expect(responseUsers.body).to.deep.equal([{id: 1, login: "admin1", password: "admin1"}]);
            chai.expect(responseUsers.statusCode).to.equal(200);
            done();
          }
        });
    });

    it("returns status 400 on request without token", (done) => {
      chai
        .request(urlBase + "api/")
        .get("users")
        .set("content-type", "application/x-www-form-urlencoded")
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
        .get("users")
        .set("content-type", "application/x-www-form-urlencoded")
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
        .get("users")
        .set("content-type", "application/x-www-form-urlencoded")
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
        .get("users")
        .set("content-type", "application/x-www-form-urlencoded")
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
        id: 1,
        exp: Math.floor(Date.now() / 1000) - 10000// expired 10s before
      }, config.secret);
      chai
        .request(urlBase + "api/")
        .get("users")
        .set("content-type", "application/x-www-form-urlencoded")
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

    // Ask later
    it("returns status 400 on request with valid JWT without 'Bearer' signed in header", (done) => {
      chai
        .request(urlBase + "api/")
        .get("users")
        .set("content-type", "application/x-www-form-urlencoded")
        .set("authorization", validToken)
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
        .get("users")
        .set("content-type", "application/x-www-form-urlencoded")
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
});
