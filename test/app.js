/* eslint-disable handle-callback-err,no-useless-escape,no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require("../server/db");

const urlBase = "http://localhost:8080/";

chai.use(chaiHttp);

describe("Testing Public Api", () => {
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
      db.deleteAllUsers()
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

    it("returns the status code 200 on user adding success with more params putted", (done) => {
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
        .end((error, response, body) => {
          if (!error) {
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
                  chai.expect(response.body.code).to.equal("CONFLICT");
                  chai.expect(response.body.message).to.equal("Conflict");
                  done();
                }
              });
          } else {
            return done(error);
          }
        });
    });
  });
});
